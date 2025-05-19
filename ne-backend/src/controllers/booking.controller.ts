import { RequestHandler } from 'express';
import prisma from '../prisma/prisma-client';
import ServerResponse from '../utils/ServerResponse';
import { paginator } from '../utils/paginator';
import { AuthRequest } from '../types';

export const createBooking: RequestHandler = async (req, res) => {
  const { spotId } = req.body as { spotId: string };
  const auth = req as AuthRequest;
  const userId = auth.user.id;

  // one active booking per user
  const active = await prisma.booking.findFirst({
    where: { userId, releasedAt: null }
  });
  if (active) return ServerResponse.error(res, 'Already have an active booking', null, 400);

  // spot must be free
  const spot = await prisma.parkingSpot.findUnique({ where: { id: spotId } });
  if (!spot || spot.isOccupied) return ServerResponse.error(res, 'Spot unavailable', null, 400);

  // create booking
  const booking = await prisma.booking.create({ data: { userId, spotId } });
  await prisma.parkingSpot.update({
    where: { id: spotId },
    data: { isOccupied: true }
  });
  return ServerResponse.created(res, 'Booking created', booking);
};

export const releaseBooking: RequestHandler = async (req, res) => {
  const { bookingId } = req.body as { bookingId: string };
  const auth = req as AuthRequest;
  const userId = auth.user.id;
  const isAdmin = auth.user.role === 'ADMIN';

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.releasedAt)
    return ServerResponse.error(res, 'Invalid booking', null, 400);

  if (!isAdmin && booking.userId !== userId)
    return ServerResponse.error(res, 'Forbidden', null, 403);

  // release
  await prisma.booking.update({
    where: { id: bookingId },
    data: { releasedAt: new Date() }
  });
  await prisma.parkingSpot.update({
    where: { id: booking.spotId },
    data: { isOccupied: false }
  });

  return ServerResponse.success(res, 'Booking released');
};

export const listBookings: RequestHandler = async (req, res) => {
  const auth = req as AuthRequest;
  const isAdmin = auth.user.role === 'ADMIN';
  const { page = 1, limit = 10, status } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (!isAdmin) where.userId = auth.user.id;
  if (status === 'ongoing') where.releasedAt = null;
  if (status === 'completed') where.releasedAt = { not: null };

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      skip,
      take: Number(limit),
      include: { spot: true, user: true },
      orderBy: { bookedAt: 'desc' }
    })
  ]);
  const booking_response = bookings.map((booking) => ({ id: booking.id, user:{user_id:booking.user.id, email:booking.user.email, name: booking.user.firstName, vehicle_plate_number: booking.user.vehiclePlateNumber }, spot: { id: booking.spot.id, spotNumber: booking.spot.spotNumber } , entry_time: booking.bookedAt, exit_time: booking.releasedAt, status: booking.releasedAt ? 'complete' : 'ongoing'  } ));
  const meta = paginator({ page: Number(page), limit: Number(limit), total });
  return ServerResponse.success(res, 'Bookings fetched', { booking_response, meta });
};
