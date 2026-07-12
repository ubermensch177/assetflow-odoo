import { Router } from 'express';
import { getAssets, getAssetById, createAsset, allocateAsset, returnAsset, transferAsset, getOverdueAssets } from '../controllers/assetController';

const router = Router();

router.get('/', getAssets);
router.get('/overdue', getOverdueAssets);
router.post('/', createAsset);
router.get('/:id', getAssetById);

router.post('/:id/allocate', allocateAsset);
router.post('/:id/return', returnAsset);
router.post('/:id/transfer', transferAsset);

export default router;
