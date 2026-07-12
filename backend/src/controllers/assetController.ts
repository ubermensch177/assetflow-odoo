import { Request, Response } from 'express';
import { AssetService } from '../services/assetService';
import { AllocationService } from '../services/allocationService';

export const getAssets = async (req: Request, res: Response) => {
  try {
    const assets = await AssetService.getAssets(req.query);
    res.json(assets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOverdueAssets = async (req: Request, res: Response) => {
  try {
    const overdue = await AssetService.getOverdueAssets();
    res.json(overdue);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssetById = async (req: Request, res: Response) => {
  try {
    const asset = await AssetService.getAssetById(req.params.id as string);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json(asset);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createAsset = async (req: Request, res: Response) => {
  try {
    const performedBy = req.headers['x-user-id'] as string || 'SystemAdmin';
    const asset = await AssetService.createAsset(req.body, performedBy);
    res.status(201).json(asset);
  } catch (error: any) {
    console.error('Create Asset Error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const allocateAsset = async (req: Request, res: Response) => {
  try {
    const { assignedTo, expectedReturn, conditionOnOut, purpose, notes } = req.body;
    const performedBy = req.headers['x-user-id'] as string || 'SystemAdmin';
    
    const allocation = await AllocationService.allocateAsset(
      req.params.id as string,
      assignedTo,
      expectedReturn ? new Date(expectedReturn) : null,
      performedBy,
      conditionOnOut,
      purpose,
      notes
    );
    res.status(200).json(allocation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const returnAsset = async (req: Request, res: Response) => {
  try {
    const { conditionOnIn } = req.body;
    const performedBy = req.headers['x-user-id'] as string || 'SystemAdmin';
    
    const returned = await AllocationService.returnAsset(
      req.params.id as string,
      conditionOnIn,
      performedBy
    );
    res.status(200).json(returned);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const transferAsset = async (req: Request, res: Response) => {
  try {
    const { newAssignedTo, expectedReturn, condition } = req.body;
    const performedBy = req.headers['x-user-id'] as string || 'SystemAdmin';
    
    const transfer = await AllocationService.transferAsset(
      req.params.id as string,
      newAssignedTo,
      expectedReturn ? new Date(expectedReturn) : null,
      condition,
      performedBy
    );
    res.status(200).json(transfer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
