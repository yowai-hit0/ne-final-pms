import { RequestHandler } from "express";
import { Role } from "@prisma/client";
import ServerResponse from "../utils/ServerResponse";
import { AuthRequest } from "../types";

/**
 * Allows only the specified roles.
 * e.g. roleMiddleware(Role.ADMIN, Role.STUDENT)
 */
export const roleMiddleware =
  (...allowed: Role[]): RequestHandler =>
  (req, res, next) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || !allowed.includes(authReq.user.role)) {
      ServerResponse.error(res, "Forbidden", null, 403);
      return;
    }
    next();
  };
