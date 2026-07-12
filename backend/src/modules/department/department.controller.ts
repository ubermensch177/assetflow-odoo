import { Request, Response, NextFunction } from 'express';
import * as departmentService from './department.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = (req as any).user.id;
    const dept = await departmentService.createDepartment(req.body, adminId);
    res.status(201).json(dept);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const depts = await departmentService.getDepartments();
    res.json(depts);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = (req as any).user.id;
    const dept = await departmentService.updateDepartment(req.params.id as string, req.body, adminId);
    res.json(dept);
  } catch (error) {
    next(error);
  }
};
