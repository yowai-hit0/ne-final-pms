import { Router } from 'express';
import {
  listAllSpots,
  listAvailableSpots,
  createSpot,
  generateSpots,
  deleteSpot
} from '../controllers/spot.controller';
import { verifyAuth } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  CreateSpotDTO,
  GenerateSpotsDTO,
  ListSpotsDTO
} from '../dtos/spot.dto';

const router = Router();

// Admin-only CRUD & generate
// router.use(verifyAuth, roleMiddleware('ADMIN'));
router.get('/', verifyAuth, roleMiddleware('ADMIN'), validateRequest(ListSpotsDTO, 'query'), listAllSpots);
router.post( '/', verifyAuth, roleMiddleware('ADMIN'), validateRequest(CreateSpotDTO), createSpot);
router.post('/generate', verifyAuth, roleMiddleware('ADMIN'), validateRequest(GenerateSpotsDTO), generateSpots);
router.delete('/:id', verifyAuth, roleMiddleware('ADMIN'), deleteSpot);

// Public (authenticated) view: available spots
router.get('/available', verifyAuth,  validateRequest(ListSpotsDTO, 'query'), listAvailableSpots);

export default router;
