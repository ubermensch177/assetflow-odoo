const express = require('express');
const router = express.Router();
const AssetController = require('../controllers/AssetController');
const { authenticateToken } = require('../middlewares/auth');

router.use(authenticateToken);

router.get('/assets', AssetController.getAssets);
router.post('/assets', AssetController.createAsset);
router.get('/assets/:id', AssetController.getAssetById);
router.get('/allocations', AssetController.getAllocations);
router.post('/allocations', AssetController.createAllocation);

router.put('/assets/:id', AssetController.updateAsset);
router.delete('/assets/:id', AssetController.deleteAsset);

module.exports = router;
