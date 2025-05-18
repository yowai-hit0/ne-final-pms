// src/routes/index.routes.ts
import { Router } from "express";
import authRouter from "./auth.routes";
import spotRouter from "./spot.routes";
import bookingRouter from "./booking.routes";
// import userRouter from "./user.routes";

const router = Router();

// ─── Auth ──────────────────────────────────────────────────────────────────────
router.use(
  "/auth",
  authRouter
  /* 
    #swagger.tags = ['Auth']
    #swagger.description = 'Authentication endpoints (register, login, OTP, etc.)'
  */
);

// ─── Parking Spots ─────────────────────────────────────────────────────────────
router.use(
  "/spots",
  spotRouter
  /*
    #swagger.tags = ['Parking Spots']
    #swagger.description = 'Manage parking slots: list, create, generate, delete'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

// ─── Bookings ──────────────────────────────────────────────────────────────────
router.use(
  "/bookings",
  bookingRouter
  /*
    #swagger.tags = ['Bookings']
    #swagger.description = 'Create, list, and release parking bookings'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

// ─── Users ─────────────────────────────────────────────────────────────────────
// router.use(
//   "/user",
//   userRouter
//   /*
//     #swagger.tags = ['Users']
//     #swagger.description = 'User management (view profile, update, etc.)'
//     #swagger.security = [{ "bearerAuth": [] }]
//   */
// );

export default router;
