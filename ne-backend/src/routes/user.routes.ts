import { Router } from 'express';
import {getProfile, updateProfile, updateUser, fetchUsers, deleteUser, fetchUserById} from '../controllers/user.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { verifyAuth } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';
import {
  UpdateUserDto,
  AdminUpdateUserDto,
  ListUserQueryDto,
} from '../dtos/user.dto';

const router = Router();

// — Profile (any authenticated user) —
router.get(
  '/profile',
  verifyAuth,
  getProfile
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Get current user profile'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

router.put(
  '/profile',
  verifyAuth,
  validateRequest(UpdateUserDto),
  updateProfile
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Update current user profile'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

// — Admin: full user management —
router.get(
  '/',
  verifyAuth,
  roleMiddleware(Role.ADMIN),
  validateRequest(ListUserQueryDto, 'query'),
  fetchUsers
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'List all users'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

router.get(
  '/:id',
  verifyAuth,
  roleMiddleware(Role.ADMIN),
  fetchUserById
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Get a user by id'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

router.put(
  '/:id',
  verifyAuth,
  roleMiddleware(Role.ADMIN),
  validateRequest(AdminUpdateUserDto),
  updateUser
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Update a user by id'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

router.delete(
  '/:id',
  verifyAuth,
  roleMiddleware(Role.ADMIN),
  deleteUser
  /*
    #swagger.tags = ['Users']
    #swagger.description = 'Delete a user by id'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

export default router;
