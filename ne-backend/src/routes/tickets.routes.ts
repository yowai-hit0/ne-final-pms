import { Router } from "express";
import {
  createTicket,
  checkoutTicket,
  listUserTickets,
  listAllTickets,
  reportEntries,
  reportExits,
} from "../controllers/ticket.controller";
import { verifyAuth } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  CreateTicketDTO,
  CheckoutTicketDTO,
  ListTicketsDTO,
  ReportDTO,
} from "../dtos/ticket.dto";

const router = Router();

// Authenticated users
router.use(verifyAuth);

router.post(
  "/",
  validateRequest(CreateTicketDTO),
  createTicket
);

router.put(
  "/checkout",
  validateRequest(CheckoutTicketDTO),
  checkoutTicket
);

router.get(
  "/me",
  validateRequest(ListTicketsDTO, "query"),
  listUserTickets
);

// Admin & Parking Attendant
router.use(roleMiddleware("ADMIN")),
router.get(
  "/",
  validateRequest(ListTicketsDTO, "query"),
  listAllTickets
);

router.get(
  "/report/entries",
  validateRequest(ReportDTO, "query"),
  reportEntries
);

router.get(
  "/report/exits",
  validateRequest(ReportDTO, "query"),
  reportExits
);

export default router;
