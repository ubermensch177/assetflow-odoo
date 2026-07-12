import { prisma } from '../prisma';

export class HistoryService {
  static async logAction(assetId: string, action: string, performedBy: string, details?: string) {
    return prisma.assetHistory.create({
      data: {
        assetId,
        action,
        performedBy,
        details: details ?? null,
      },
    });
  }
}
