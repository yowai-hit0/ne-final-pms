import { Router } from "express";
import {
  register,
  activate,
  login,
  refreshToken,
  logout,
  requestOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  RegisterDTO,
  LoginDTO,
  EmailDTO,
  ResetPasswordDTO,
} from "../dtos/auth.dto";
import { verifyAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validateRequest(RegisterDTO), register);
router.post("/activate", validateRequest(EmailDTO), activate);
router.post("/login", validateRequest(LoginDTO), login);
router.post("/refresh-token", refreshToken);
router.post(
  "/logout",
  verifyAuth,
  logout
  /* #swagger.tags=['Auth'] #swagger.security=[{"bearerAuth": []}] */
);

// Password-reset flows
router.post("/request-otp", validateRequest(EmailDTO), requestOtp);
router.post("/verify-otp", validateRequest(EmailDTO), verifyOtp);
router.post("/forgot-password", validateRequest(EmailDTO), forgotPassword);
router.post(
  "/reset-password",
  validateRequest(ResetPasswordDTO),
  resetPassword
);

export default router;
