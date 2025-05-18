import { config } from "dotenv";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma-client";
import ServerResponse from "../utils/ServerResponse";
import { sendOtpEmail } from "../utils/otp";

config();
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY = "15m",
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY = "7d",
  OTP_EXPIRY_MINUTES = "15",
} = process.env;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("Missing ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET in .env");
}

// ─── Register ──────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, vehiclePlateNumber } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return ServerResponse.error(res, "Email already in use", null, 409);
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        status: "DISABLED",
        // include plate if provided
        vehiclePlateNumber: vehiclePlateNumber || null,
      },
    });

    // create activation OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + Number(OTP_EXPIRY_MINUTES) * 60_000);
    await prisma.oTP.create({
      data: { email, code, expiresAt, type: "ACTIVATION" },
    });
    await sendOtpEmail(email, code, "activation");

    return ServerResponse.success(res, "Registered. Check email for activation code.");
  } catch (err: any) {
    return ServerResponse.error(res, "Error occurred", { error: err });
  }
};


export const activate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;
    const otp = await prisma.oTP.findFirst({
      where: { email, code, type: "ACTIVATION" },
      orderBy: { createdAt: "desc" },
    });
    if (!otp || otp.expiresAt < new Date()) {
      return ServerResponse.error(res, "Invalid or expired activation code", null, 400);
    }

    await prisma.user.update({ where: { email }, data: { status: "ENABLED" } });
    await prisma.oTP.deleteMany({ where: { email, type: "ACTIVATION" } });

    return ServerResponse.success(res, "Account activated. You can now log in.");
  } catch (err: any) {
    return ServerResponse.error(res, "Error occurred", { error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.status !== "ENABLED") {
      return ServerResponse.error(res, "Invalid credentials or not activated", null, 401);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return ServerResponse.error(res, "Invalid credentials", null, 401);
    }
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      ACCESS_TOKEN_SECRET !,
      { expiresIn: ACCESS_TOKEN_EXPIRY } as any
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      REFRESH_TOKEN_SECRET! ,
      { expiresIn: REFRESH_TOKEN_EXPIRY } as any
    );

    // set HttpOnly cookie for refresh
    res.cookie("jid", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refresh-token",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(REFRESH_TOKEN_EXPIRY),
    });

    return ServerResponse.success(res, "Login successful", { accessToken });
  } catch (err: any) {
    return ServerResponse.error(res, "Error occurred", { error: err });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
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
    if (!user || user.status !== "ENABLED") {
      return ServerResponse.error(res, "User not found or not activated", null, 401);
    }
    const newAccess = jwt.sign(
      { id: user.id, role: user.role },
      ACCESS_TOKEN_SECRET !,
      { expiresIn: ACCESS_TOKEN_EXPIRY } as any
    );

    const newRefresh = jwt.sign(
      { id: user.id, role: user.role },
      REFRESH_TOKEN_SECRET! ,
      { expiresIn: REFRESH_TOKEN_EXPIRY } as any
    );
    
    res.cookie("jid", newRefresh, {
      httpOnly: true,
      path: "/api/auth/refresh-token",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(REFRESH_TOKEN_EXPIRY),
    });

    return ServerResponse.success(res, "Token refreshed", { accessToken: newAccess });
  } catch (err: any) {
    return ServerResponse.error(res, "Error occurred", { error: err });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie("jid", { path: "/api/auth/refresh-token" });
  return ServerResponse.success(res, "Logged out successfully");
};

// Reuse for password-reset flows:
export const requestOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + Number(OTP_EXPIRY_MINUTES) * 60_000);
    await prisma.oTP.create({ data: { email, code, expiresAt, type: "RESET" } });
    await sendOtpEmail(email, code, "reset");
    return ServerResponse.success(res, "Reset OTP sent");
  } catch (err: any) {
    return ServerResponse.error(res, "Error occurred", { error: err });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;
    const otp = await prisma.oTP.findFirst({
      where: { email, code, type: "RESET" },
      orderBy: { createdAt: "desc" },
    });
    if (!otp || otp.expiresAt < new Date()) {
      return ServerResponse.error(res, "Invalid or expired OTP", null, 400);
    }
    return ServerResponse.success(res, "OTP verified", { verified: true });
  } catch (err: any) {
    return ServerResponse.error(res, "Error occurred", { error: err });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  // alias to requestOtp
  await requestOtp(req, res);
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, newPassword } = req.body;
    const otp = await prisma.oTP.findFirst({
      where: { email, code, type: "RESET" },
      orderBy: { createdAt: "desc" },
    });
    if (!otp || otp.expiresAt < new Date()) {
      return ServerResponse.error(res, "Invalid or expired OTP", null, 400);
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { password: hashed } });
    await prisma.oTP.deleteMany({ where: { email, type: "RESET" } });
    return ServerResponse.success(res, "Password reset successful");
  } catch (err: any) {
    return ServerResponse.error(res, "Error occurred", { error: err });
  }
};

/** Utility to convert expiry like "7d"|"15m" to ms */
function ms(str: string) {
  const num = parseInt(str, 10);
  if (str.endsWith("d")) return num * 24 * 60 * 60 * 1000;
  if (str.endsWith("h")) return num * 60 * 60 * 1000;
  if (str.endsWith("m")) return num * 60 * 1000;
  return num;
}
