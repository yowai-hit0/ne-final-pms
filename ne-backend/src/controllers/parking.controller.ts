import { RequestHandler } from "express";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { paginator } from "../utils/paginator";

export const listAllParking: RequestHandler = async (req, res) => {
  const { page = 1, limit = 10 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const [total, parkings] = await Promise.all([
    prisma.parking.count(),
    prisma.parking.findMany({
      skip,
      take: Number(limit),
      orderBy: { name: "asc" },
    }),
  ]);

  const meta = paginator({ page: Number(page), limit: Number(limit), total });
  return ServerResponse.success(res, "Parking locations fetched", {
    parkings,
    meta,
  });
};

export const listAvailableParking: RequestHandler = async (req, res) => {
  const { page = 1, limit = 10 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const [total, parkings] = await Promise.all([
    prisma.parking.count({ where: { numberOfAvailableSpace: { gt: 0 } } }),
    prisma.parking.findMany({
      where: { numberOfAvailableSpace: { gt: 0 } },
      skip,
      take: Number(limit),
      orderBy: { name: "asc" },
    }),
  ]);

  const meta = paginator({ page: Number(page), limit: Number(limit), total });
  return ServerResponse.success(res, "Available parking locations fetched", {
    parkings,
    meta,
  });
};

export const createParking: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    const parking = await prisma.parking.create({ data });
    return ServerResponse.created(res, "Parking location created", parking);
  } catch (err: any) {
    return ServerResponse.error(res, err.meta?.cause ?? "Error creating parking", null, 400);
  }
};

export const updateParking: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const existing = await prisma.parking.findUnique({ where: { id } });
  if (!existing) return ServerResponse.notFound(res, "Parking location not found");

  const updated = await prisma.parking.update({
    where: { id },
    data: updateData,
  });
  return ServerResponse.success(res, "Parking location updated", updated);
};

export const deleteParking: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.parking.findUnique({ where: { id } });
  if (!existing) return ServerResponse.notFound(res, "Parking location not found");

  await prisma.parking.delete({ where: { id } });
  return ServerResponse.success(res, "Parking location deleted");
};
