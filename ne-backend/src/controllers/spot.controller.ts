import { RequestHandler } from 'express';
import prisma from '../prisma/prisma-client';
import ServerResponse from '../utils/ServerResponse';
import { paginator } from '../utils/paginator';

export const listAllSpots: RequestHandler = async (req, res) => {
  const { page = 1, limit = 10 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const [total, spots] = await Promise.all([
    prisma.parkingSpot.count(),
    prisma.parkingSpot.findMany({
      skip,
      take: Number(limit),
      include: {
        bookings: { where: { releasedAt: null }, take: 1 } // current booking if any
      }
    })
  ]);

  const meta = paginator({ page: Number(page), limit: Number(limit), total });
  return ServerResponse.success(res, 'All spots fetched', { spots, meta });
};

export const listAvailableSpots: RequestHandler = async (req, res) => {
  const { page = 1, limit = 10 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const [total, spots] = await Promise.all([
    prisma.parkingSpot.count({ where: { isOccupied: false } }),
    prisma.parkingSpot.findMany({
      where: { isOccupied: false },
      skip,
      take: Number(limit)
    })
  ]);

  const meta = paginator({ page: Number(page), limit: Number(limit), total });
  return ServerResponse.success(res, 'Available spots fetched', { spots, meta });
};

export const createSpot: RequestHandler = async (req, res) => {
  try {
    const { spotNumber } = req.body;
    const spot = await prisma.parkingSpot.create({ data: { spotNumber } });
    return ServerResponse.created(res, 'Spot created', spot);
  } catch (err: any) {
    return ServerResponse.error(res, err.meta?.cause ?? 'Error creating spot', null, 400);
  }
};

export const generateSpots: RequestHandler = async (req, res) => {
  const { prefix, count } = req.body as { prefix: string; count: number };
  const created = [];
  for (let i = 1; i <= count; i++) {
    const spotNumber = `${prefix}${i}`;
    try {
      const spot = await prisma.parkingSpot.create({ data: { spotNumber } });
      created.push(spot);
    } catch {
      // skip duplicates
    }
  }
  return ServerResponse.created(res, 'Spots generated', created);
};

export const deleteSpot: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const spot = await prisma.parkingSpot.findUnique({ where: { id } });
  if (!spot) return ServerResponse.notFound(res, 'Spot not found');
  if (spot.isOccupied) return ServerResponse.error(res, 'Spot is occupied', null, 400);

  await prisma.parkingSpot.delete({ where: { id } });
  return ServerResponse.success(res, 'Spot deleted');
};
