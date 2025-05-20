import { Router } from 'express';
import {
  listAllParking,
  listAvailableParking,
  createParking,
  updateParking,
  deleteParking
} from '../controllers/parking.controller';
import { verifyAuth } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  CreateParkingDTO,
  UpdateParkingDTO,
  ListParkingDTO
} from '../dtos/parking.dto';

const router = Router();

// ─── Public (authenticated) ───────────────────────────────────────────────────
// any logged-in driver, attendant, or admin can view available lots
router.get(
  '/available',
  verifyAuth,
  validateRequest(ListParkingDTO, 'query'),
  listAvailableParking
);

// ─── Admin-only CRUD ───────────────────────────────────────────────────────────
router.use(verifyAuth, roleMiddleware('ADMIN'));

router.get(
  '/',
  validateRequest(ListParkingDTO, 'query'),
  listAllParking
);

router.post(
  '/',
  validateRequest(CreateParkingDTO),
  createParking
);

router.put(
  '/:id',
  validateRequest(UpdateParkingDTO),
  updateParking
);

router.delete(
  '/:id',
  deleteParking
);

export default router;
