// src/routes/index.routes.ts
import { Router } from "express";
import authRouter from "./auth.routes";
import parkingRouter from "./parking.routes";
import ticketRouter from './tickets.routes'
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


// ─── Bookings ──────────────────────────────────────────────────────────────────
router.use(
  "/parkings",
  parkingRouter
  /*
    #swagger.tags = ['parking']
    #swagger.description = 'Create, list, and release parking bookings'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);


// ─── tickets ─────────────────────────────────────────────────────────────────────
router.use(
  "/tickets",
  ticketRouter
  /*
    #swagger.tags = ['ticket']
    #swagger.description = 'ticket management (view profile, update, etc.)'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

export default router;
