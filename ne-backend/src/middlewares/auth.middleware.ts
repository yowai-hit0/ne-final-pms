import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";

// Keep AuthRequest type purely for downstream code
import { AuthRequest } from "../types";

const { ACCESS_TOKEN_SECRET } = process.env;

export const verifyAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ServerResponse.error(res, "Authorization header missing", null, 401);
    return;
  }

  const token = authHeader.slice(7);
  let payload: { id: string; role: string };
  try {
    payload = jwt.verify(token, ACCESS_TOKEN_SECRET!) as any;
  } catch {
    ServerResponse.error(res, "Invalid or expired token", null, 401);
    return;
  }

  // Fetch the user (you can skip status check here)
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) {
    ServerResponse.error(res, "User not found", null, 401);
    return;
  }

  // Cast and attach
  (req as AuthRequest).user = {
    id: user.id,
    role: user.role,
  };

  next();
};
