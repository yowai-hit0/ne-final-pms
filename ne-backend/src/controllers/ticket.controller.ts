import { RequestHandler } from "express";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { paginator } from "../utils/paginator";
import { AuthRequest } from "../types";

export const createTicket: RequestHandler = async (req, res) => {
  const auth = req as AuthRequest;
  const userId = auth.user.id;
  const { parkingId } = req.body as { parkingId: string };

  try {
    const ticket = await prisma.$transaction(async (tx) => {
      const park = await tx.parking.findUnique({ where: { id: parkingId } });
      if (!park || park.numberOfAvailableSpace < 1) {
        throw new Error("No available spaces");
      }

      const t = await tx.ticket.create({ data: { userId, parkingId } });
      await tx.parking.update({
        where: { id: parkingId },
        data: { numberOfAvailableSpace: park.numberOfAvailableSpace - 1 },
      });
      return t;
    });

    return ServerResponse.created(res, "Ticket created", ticket);
  } catch (err: any) {
    return ServerResponse.error(res, err.message || "Error creating ticket", null, 400);
  }
};

export const checkoutTicket: RequestHandler = async (req, res) => {
  const auth = req as AuthRequest;
  const userId = auth.user.id;
  const isAdmin = auth.user.role === "ADMIN";
  const { ticketId } = req.body as { ticketId: string };

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketId },
        include: { parking: true },
      });
      if (!ticket || ticket.exitTime) {
        throw new Error("Invalid or already checked-out ticket");
      }
      if (!isAdmin && ticket.userId !== userId) {
        throw new Error("Forbidden");
      }

      const now = new Date();
      const diffMs = now.getTime() - ticket.entryTime.getTime();
      const hours = Math.ceil(diffMs / (1000 * 60 * 60));
      const amount = hours * ticket.parking.chargingFeePerHour;

      const t = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          exitTime: now,
          chargedAmount: amount,
        },
      });

      await tx.parking.update({
        where: { id: ticket.parkingId },
        data: { numberOfAvailableSpace: ticket.parking.numberOfAvailableSpace + 1 },
      });

      return t;
    });

    return ServerResponse.success(res, "Checked out successfully", updated);
  } catch (err: any) {
    return ServerResponse.error(res, err.message || "Error during checkout", null, 400);
  }
};

export const listUserTickets: RequestHandler = async (req, res) => {
  const auth = req as AuthRequest;
  const userId = auth.user.id;
  const { page = 1, limit = 10 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const [total, tickets] = await Promise.all([
    prisma.ticket.count({ where: { userId } }),
    prisma.ticket.findMany({
      where: { userId },
      skip,
      take: Number(limit),
      include: { parking: true },
      orderBy: { entryTime: "desc" },
    }),
  ]);

  const meta = paginator({ page: Number(page), limit: Number(limit), total });
  return ServerResponse.success(res, "Your tickets fetched", { tickets, meta });
};

export const listAllTickets: RequestHandler = async (req, res) => {
  const { page = 1, limit = 10 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const [total, tickets] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.findMany({
      skip,
      take: Number(limit),
      include: { parking: true, user: true },
      orderBy: { entryTime: "desc" },
    }),
  ]);

  const meta = paginator({ page: Number(page), limit: Number(limit), total });
  return ServerResponse.success(res, "All tickets fetched", { tickets, meta });
};

export const reportEntries: RequestHandler = async (req, res) => {
  const { startDate, endDate, page = 1, limit = 10 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where = {
    entryTime: {
      gte: new Date(startDate),
      lte: new Date(endDate),
    },
  };

  const [total, tickets] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      skip,
      take: Number(limit),
      include: { parking: true, user: true },
      orderBy: { entryTime: "desc" },
    }),
  ]);

  const meta = paginator({ page: Number(page), limit: Number(limit), total });
  return ServerResponse.success(res, "Entry report fetched", { tickets, meta });
};

export const reportExits: RequestHandler = async (req, res) => {
  const { startDate, endDate, page = 1, limit = 10 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where = {
    exitTime: {
      not: null,
      gte: new Date(startDate),
      lte: new Date(endDate),
    },
  };

  const [total, tickets] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      skip,
      take: Number(limit),
      include: { parking: true, user: true },
      orderBy: { exitTime: "desc" },
    }),
  ]);

  const meta = paginator({ page: Number(page), limit: Number(limit), total });
  return ServerResponse.success(res, "Exit report fetched", { tickets, meta });
};
