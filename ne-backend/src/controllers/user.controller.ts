import { Prisma, Role } from '@prisma/client';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import prisma from '../prisma/prisma-client';
import { AuthRequest } from '../types';
import ServerResponse from '../utils/ServerResponse';
import { paginator } from '../utils/paginator';

config();

/** GET /user?searchKey=&page=&limit= (admin only) */
export const fetchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { searchKey, page, limit } = req.query as any;
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;

    if (pageNum <= 0) {
      ServerResponse.error(res, 'Page number must be > 0', null, 400);
      return;
    }
    if (limitNum <= 0) {
      ServerResponse.error(res, 'Limit must be > 0', null, 400);
      return;
    }

    const where: Prisma.UserWhereInput = {};
    if (searchKey) {
      where.OR = [
        { firstName: { contains: String(searchKey), mode: 'insensitive' } },
        { lastName:  { contains: String(searchKey), mode: 'insensitive' } },
        { email:     { contains: String(searchKey), mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip:  (pageNum - 1) * limitNum,
        take:  limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, firstName: true, lastName: true,
          email: true, role: true, createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    ServerResponse.success(res, 'Users fetched successfully', {
      users,
      meta: paginator({ page: pageNum, limit: limitNum, total }),
    });
  } catch (error) {
    ServerResponse.error(res, 'Error occurred', { error });
  }
};

/** GET /user/profile */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const user = await prisma.user.findUnique({
      where: { id: authReq.user.id },
      select: {
        id: true, firstName: true, lastName: true,
        email: true, role: true, createdAt: true, updatedAt: true,
      },
    });
    if (!user) {
      ServerResponse.notFound(res, 'User not found');
      return;
    }
    return ServerResponse.success(res, 'Profile fetched successfully', { user });
  } catch (error) {
    return ServerResponse.error(res, 'Error occurred', { error });
  }
};

/** PUT /user/profile */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const data = req.body;
    if (Object.keys(data).length === 0) {
      ServerResponse.error(res, 'No data provided', null, 400);
      return;
    }

    const user = await prisma.user.update({
      where: { id: authReq.user.id },
      data,
      select: {
        id: true, firstName: true, lastName: true,
        email: true, role: true, createdAt: true, updatedAt: true,
      },
    });
    return ServerResponse.success(res, 'Profile updated successfully', { user });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const key = (error.meta.target as string[])[0];
      return ServerResponse.error(res, `${key.charAt(0).toUpperCase()+key.slice(1)} already in use`, null, 400);
    } else {
      return ServerResponse.error(res, 'Error occurred', { error });
    }
  }
};

/** GET /user/:id (admin only) */
export const fetchUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, firstName: true, lastName: true,
        email: true, role: true, createdAt: true, updatedAt: true,
      },
    });
    if (!user) {
      ServerResponse.notFound(res, `User with id ${id} not found`);
      return;
    }
   return ServerResponse.success(res, 'User fetched successfully', { user });
  } catch (error) {
   return ServerResponse.error(res, 'Error occurred', { error });
  }
};

/** PUT /user/:id (admin only) */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true, firstName: true, lastName: true,
        email: true, role: true, createdAt: true, updatedAt: true,
      },
    });
   return ServerResponse.success(res, 'User updated successfully', { user });
  } catch (error: any) {
    if (error.code === 'P2002') {
      const key = (error.meta.target as string[])[0];
      return ServerResponse.error(res, `${key.charAt(0).toUpperCase()+key.slice(1)} already in use`, null, 400);
    } else {
      return ServerResponse.error(res, 'Error occurred', { error });
    }
  }
};

/** DELETE /user/:id (admin only) */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
   return ServerResponse.success(res, 'User deleted successfully');
  } catch (error) {
   return ServerResponse.error(res, 'Error occurred', { error });
  }
};
