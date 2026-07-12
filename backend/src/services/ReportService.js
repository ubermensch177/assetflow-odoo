const { PrismaClient } = require('@prisma/client');
const AssetService = require('./AssetService');
const prisma = new PrismaClient();

class ReportService {
  async getEnterpriseAnalytics() {
    // 1. Core Counts
    const [totalAssets, availableAssets, maintenanceAssets, totalUsers, totalDepartments] = await Promise.all([
      prisma.asset.count(),
      prisma.asset.count({ where: { status: 'AVAILABLE' } }),
      prisma.asset.count({ where: { status: 'UNDER_MAINTENANCE' } }),
      prisma.user.count(),
      prisma.department.count()
    ]);

    // 2. Department Allocations
    const deptAllocations = await prisma.department.findMany({
      include: { _count: { select: { assets: true } } }
    });

    // 3. Maintenance Costs
    const maintenanceCost = await prisma.maintenanceRequest.aggregate({
      _sum: { cost: true }
    });

    // 4. Asset Condition Distribution
    const assetCondition = await prisma.asset.groupBy({
      by: ['condition'],
      _count: { id: true }
    });

    // 5. Vendor Performance (Advanced)
    // Group assets by vendor, calculate average health score manually (since Prisma doesn't do complex math grouping natively well on derived fields)
    const allAssets = await prisma.asset.findMany({
      include: { maintenanceReqs: true }
    });
    
    const enrichedAssets = allAssets.map(a => AssetService.enrichAssetWithEnterpriseLogic(a));
    
    const vendorStats = {};
    let totalPortfolioValue = 0;
    
    enrichedAssets.forEach(asset => {
      const vendor = asset.vendor || 'Unknown Vendor';
      if (!vendorStats[vendor]) {
        vendorStats[vendor] = { count: 0, totalHealth: 0, totalMaintenanceCost: 0 };
      }
      vendorStats[vendor].count += 1;
      vendorStats[vendor].totalHealth += asset.intelligence.healthScore;
      vendorStats[vendor].totalMaintenanceCost += asset.intelligence.totalMaintenanceCost;
      totalPortfolioValue += (asset.purchaseCost || 0);
    });

    const vendorPerformance = Object.keys(vendorStats).map(vendor => ({
      vendor,
      assetCount: vendorStats[vendor].count,
      avgHealthScore: Math.round(vendorStats[vendor].totalHealth / vendorStats[vendor].count),
      totalMaintenanceCost: vendorStats[vendor].totalMaintenanceCost
    })).sort((a, b) => b.totalMaintenanceCost - a.totalMaintenanceCost).slice(0, 5);

    // 6. Procurement Suggestions (Replacement Candidates)
    const procurementSuggestions = enrichedAssets
      .filter(a => a.intelligence.replacementRecommendation)
      .map(a => ({
        id: a.id,
        assetTag: a.assetTag,
        name: a.name,
        healthScore: a.intelligence.healthScore,
        tco: a.intelligence.tco
      }));

    return {
      kpis: {
        totalAssets,
        availableAssets,
        maintenanceAssets,
        totalUsers,
        totalDepartments,
        totalPortfolioValue,
        totalMaintenanceCost: maintenanceCost._sum.cost || 0
      },
      charts: {
        deptAllocations: deptAllocations.map(d => ({ name: d.name, count: d._count.assets })),
        assetCondition
      },
      vendorPerformance,
      procurementSuggestions
    };
  }
}

module.exports = new ReportService();
