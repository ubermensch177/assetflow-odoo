import { Request, Response, NextFunction } from 'express';
import * as categoryService from './category.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = (req as any).user.id;
    const cat = await categoryService.createCategory(req.body, adminId);
    res.status(201).json(cat);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cats = await categoryService.getCategories();
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = (req as any).user.id;
    const cat = await categoryService.updateCategory(req.params.id as string, req.body, adminId);
    res.json(cat);
  } catch (error) {
    next(error);
  }
};
