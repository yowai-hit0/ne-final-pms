import { config } from "dotenv";
import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { AuthRequest } from "../types";
import cookieParser from "cookie-parser";

config();
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY = "15m",
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY = "7d",
} = process.env;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "Missing ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET in .env"
  );
}

// ─── Register ──────────────────────────────────────────────────────────────────
export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password, firstName, lastName, vehiclePlateNumber } =
      req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return ServerResponse.error(res, "Email already in use", null, 409);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        vehiclePlateNumber: vehiclePlateNumber || null,
        // role defaults to USER
      },
    });

    return ServerResponse.created(res, "Registered successfully", {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      vehiclePlateNumber: user.vehiclePlateNumber,
    });
  } catch (err: any) {
    return ServerResponse.error(res, "Error occurred", { error: err });
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────────
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return ServerResponse.error(res, "Invalid credentials", null, 401);
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      ACCESS_TOKEN_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY } as any
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      REFRESH_TOKEN_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRY } as any
    );

    // Set HttpOnly cookie for refresh token
    res.cookie("jid", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refresh-token",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(REFRESH_TOKEN_EXPIRY),
    });

    return ServerResponse.success(res, "Login successful", {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        vehiclePlateNumber: user.vehiclePlateNumber,
      },
    });
  } catch (err: any) {
    return ServerResponse.error(res, "Error occurred", { error: err });
  }
};

// ─── Refresh Token ──────────────────────────────────────────────────────────────
export const refreshToken: RequestHandler = async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (!token) {
      return ServerResponse.error(res, "No refresh token", null, 401);
    }

    let payload: any;
    try {
      payload = jwt.verify(token, REFRESH_TOKEN_SECRET!);
    } catch {
      return ServerResponse.error(res, "Invalid refresh token", null, 401);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return ServerResponse.error(res, "User not found", null, 401);
    }

    const newAccess = jwt.sign(
      { id: user.id, role: user.role },
      ACCESS_TOKEN_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY } as any
    );
    const newRefresh = jwt.sign(
      { id: user.id, role: user.role },
      REFRESH_TOKEN_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRY } as any
    );

    res.cookie("jid", newRefresh, {
      httpOnly: true,
      path: "/api/auth/refresh-token",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(REFRESH_TOKEN_EXPIRY),
    });

    return ServerResponse.success(res, "Token refreshed", {
      accessToken: newAccess,
    });
  } catch (err: any) {
    return ServerResponse.error(res, "Error occurred", { error: err });
  }
};

// ─── Get Profile ────────────────────────────────────────────────────────────────
export const getProfile: RequestHandler = async (req, res) => {
  const authReq = req as AuthRequest;
  const user = await prisma.user.findUnique({
    where: { id: authReq.user.id },
  });
  if (!user) {
    return ServerResponse.error(res, "User not found", null, 404);
  }
  return ServerResponse.success(res, "Profile fetched", {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    vehiclePlateNumber: user.vehiclePlateNumber,
  });
};

// ─── Logout ────────────────────────────────────────────────────────────────────
export const logout: RequestHandler = (_req, res) => {
  res.clearCookie("jid", { path: "/api/auth/refresh-token" });
  return ServerResponse.success(res, "Logged out successfully");
};

// ─── Utility ───────────────────────────────────────────────────────────────────
function ms(str: string) {
  const num = parseInt(str, 10);
  if (str.endsWith("d")) return num * 24 * 60 * 60 * 1000;
  if (str.endsWith("h")) return num * 60 * 60 * 1000;
  if (str.endsWith("m")) return num * 60 * 1000;
  return num;
}
