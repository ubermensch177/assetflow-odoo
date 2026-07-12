const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AssetService {
  async getAssets(query) {
    const { page = 1, limit = 50, search, status, categoryId } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status && status !== 'ALL') where.status = status;
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { assetTag: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: { category: true, department: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.asset.count({ where })
    ]);

    // Apply Business Logic Calculations
    const enrichedAssets = assets.map(this.enrichAssetWithEnterpriseLogic);

    return {
      data: enrichedAssets,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getAssetById(id) {
    const asset = await prisma.asset.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        department: true,
        allocations: { include: { user: true, department: true }, orderBy: { allocatedDate: 'desc' } },
        bookings: { include: { user: true }, orderBy: { startTime: 'desc' } },
        maintenanceReqs: { include: { requester: true }, orderBy: { createdAt: 'desc' } },
        auditRecords: { include: { auditCycle: true }, orderBy: { createdAt: 'desc' } },
        activityLogs: { include: { user: true }, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!asset) throw new Error("Asset not found");

    return this.enrichAssetWithEnterpriseLogic(asset);
  }

  enrichAssetWithEnterpriseLogic(asset) {
    const now = new Date();
    
    // Warranty Countdown (Days)
    let warrantyDaysLeft = 0;
    if (asset.warrantyExpiry) {
      const diffTime = new Date(asset.warrantyExpiry).getTime() - now.getTime();
      warrantyDaysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    // Remaining Useful Life (Months)
    let remainingUsefulLifeMonths = 0;
    let assetAgeMonths = 0;
    if (asset.purchaseDate && asset.expectedLifetime) {
      assetAgeMonths = (now.getTime() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
      remainingUsefulLifeMonths = Math.max(0, asset.expectedLifetime - Math.floor(assetAgeMonths));
    }

    // Health Score Calculation (0-100)
    let healthScore = 100;
    
    // Deduct based on condition
    const conditionPenalty = { 'NEW': 0, 'GOOD': 10, 'FAIR': 30, 'POOR': 60 };
    healthScore -= conditionPenalty[asset.condition] || 0;

    // Deduct based on age vs expected lifetime (up to 30 points)
    if (asset.expectedLifetime && assetAgeMonths > 0) {
      const ageRatio = Math.min(1, assetAgeMonths / asset.expectedLifetime);
      healthScore -= Math.floor(ageRatio * 30);
    }

    // Maintenance cost tracking & Downtime calculation
    let totalMaintenanceCost = 0;
    let downtimeDays = 0;
    if (asset.maintenanceReqs) {
      asset.maintenanceReqs.forEach(req => {
        totalMaintenanceCost += (req.cost || 0);
        // If resolved, downtime is diff between createdAt and resolvedDate. 
        // If open, downtime is diff between createdAt and now.
        const start = new Date(req.createdAt).getTime();
        const end = (req.status === 'RESOLVED' && req.updatedAt) ? new Date(req.updatedAt).getTime() : now.getTime();
        downtimeDays += Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      });
    }
    
    // Total Cost of Ownership
    const tco = (asset.purchaseCost || 0) + totalMaintenanceCost;
    
    // Replacement Recommendation
    let replacementRecommendation = false;
    if (healthScore < 40 || remainingUsefulLifeMonths === 0 || totalMaintenanceCost > (asset.purchaseCost || 0) * 0.7) {
      replacementRecommendation = true;
    }

    return {
      ...asset,
      intelligence: {
        healthScore: Math.max(0, healthScore),
        warrantyDaysLeft,
        remainingUsefulLifeMonths,
        totalMaintenanceCost,
        downtimeDays,
        tco,
        replacementRecommendation
      }
    };
  }

  async getAllocations(query) {
    const { page = 1, limit = 50, userId } = query;
    const where = userId ? { userId: parseInt(userId) } : {};
    return prisma.allocation.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: { asset: true, user: true, department: true },
      orderBy: { allocatedDate: 'desc' }
    });
  }

  async createAsset(data) {
    return prisma.asset.create({
      data: {
        name: data.name,
        assetTag: data.assetTag,
        description: data.description || '',
        categoryId: parseInt(data.categoryId),
        departmentId: data.departmentId ? parseInt(data.departmentId) : null,
        condition: data.condition || 'NEW',
        status: data.status || 'AVAILABLE',
        purchaseDate: new Date(data.purchaseDate),
        purchaseCost: parseFloat(data.purchaseCost),
        expectedLifetime: parseInt(data.expectedLifetime || 60),
        isBookable: data.isBookable || false,
      }
    });
  }
  async updateAsset(id, data) {
    return prisma.asset.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name
      }
    });
  }

  async deleteAsset(id) {
    return prisma.asset.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new AssetService();
