import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const promote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = (req as any).user.id;
    const { role } = req.body;
    const user = await userService.promoteUser(req.params.id as string, role, adminId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = (req as any).user.id;
    const { status } = req.body;
    const user = await userService.toggleUserStatus(req.params.id as string, status, adminId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
