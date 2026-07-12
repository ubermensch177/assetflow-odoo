import { prisma } from '../prisma';
import { HistoryService } from './historyService';

export class AssetService {
  static async createAsset(data: any, performedBy: string) {
    if (!data.assetTag || !data.serialNumber) {
      throw new Error('Asset Tag and Serial Number are required.');
    }

    // Check for duplicates
    const existing = await prisma.asset.findFirst({
      where: {
        OR: [
          { assetTag: data.assetTag },
          { serialNumber: data.serialNumber }
        ],
      },
    });

    if (existing) {
      throw new Error('Asset with this Tag or Serial Number already exists.');
    }

    const asset = await prisma.asset.create({ data });

    await HistoryService.logAction(asset.id, 'Created', performedBy, 'Asset registered in system');
    return asset;
  }

  static async getAssets(queryParams: any = {}) {
    const { search, category, department, status, condition, vendor, location, sharedResource, skip, take, sortBy, sortOrder } = queryParams;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { assetTag: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;
    if (department) where.department = department;
    if (status) where.status = status;
    if (condition) where.condition = condition;
    if (vendor) where.vendor = vendor;
    if (location) where.location = location;
    if (sharedResource !== undefined) where.sharedResource = sharedResource === 'true';

    const queryOptions: any = {
      where,
      orderBy: { [sortBy || 'createdAt']: sortOrder || 'desc' },
      include: { allocations: { where: { status: 'Active' } } }
    };
    
    if (skip !== undefined) queryOptions.skip = parseInt(skip);
    if (take !== undefined) queryOptions.take = parseInt(take);

    return prisma.asset.findMany(queryOptions);
  }
  
  static async getOverdueAssets() {
    return prisma.assetAllocation.findMany({
      where: {
        status: 'Active',
        expectedReturn: {
          lt: new Date()
        }
      },
      include: {
        asset: true
      }
    });
  }

  static async getAssetById(id: string) {
    return prisma.asset.findUnique({
      where: { id },
      include: {
        allocations: { orderBy: { assignedDate: 'desc' } },
        history: { orderBy: { date: 'desc' } },
        documents: true,
      },
    });
  }

  static async updateAssetStatus(id: string, status: string, performedBy: string, details: string = '') {
    const asset = await prisma.asset.update({
      where: { id },
      data: { status },
    });
    
    await HistoryService.logAction(id, 'Status_Change', performedBy, `Status changed to ${status}. ${details}`);
    return asset;
  }
}
