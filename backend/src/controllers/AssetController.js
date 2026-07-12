const AssetService = require('../services/AssetService');

class AssetController {
  async getAssets(req, res) {
    try {
      const result = await AssetService.getAssets(req.query);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  }

  async getAssetById(req, res) {
    try {
      const asset = await AssetService.getAssetById(req.params.id);
      res.json(asset);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Asset not found" });
    }
  }

  async createAsset(req, res) {
    try {
      const newAsset = await AssetService.createAsset(req.body);
      res.status(201).json(newAsset);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to create asset" });
    }
  }

  async getAllocations(req, res) {
    try {
      const query = { ...req.query };
      if (req.user.role === 'EMPLOYEE') {
        query.userId = req.user.id;
      }
      const allocations = await AssetService.getAllocations(query);
      res.json(allocations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch allocations" });
    }
  }

  async createAllocation(req, res) {
    try {
      const WorkflowService = require('../services/WorkflowService');
      const allocation = await WorkflowService.allocateAsset(req.body, req.user.id);
      res.status(201).json(allocation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to allocate asset' });
    }
  }
}

module.exports = new AssetController();
