import { prisma } from '../prisma';
import { HistoryService } from './historyService';

export class AllocationService {
  static async allocateAsset(assetId: string, assignedTo: string, expectedReturn: Date | null, performedBy: string, conditionOnOut: string, purpose?: string, notes?: string) {
    // Check if currently allocated
    const activeAllocation = await prisma.assetAllocation.findFirst({
      where: { assetId, status: 'Active' },
    });

    if (activeAllocation) {
      throw new Error('Asset is already allocated.');
    }

    const allocation = await prisma.assetAllocation.create({
      data: {
        assetId,
        assignedTo,
        expectedReturn: expectedReturn ? new Date(expectedReturn) : null,
        conditionOnOut,
        purpose: purpose || null,
        notes: notes || null,
        status: 'Active',
      },
    });

    await prisma.asset.update({
      where: { id: assetId },
      data: { status: 'Allocated', currentHolderId: assignedTo },
    });

    await HistoryService.logAction(assetId, 'Allocated', performedBy, `Allocated to ${assignedTo}`);
    
    return allocation;
  }

  static async returnAsset(assetId: string, conditionOnIn: string, performedBy: string) {
    const activeAllocation = await prisma.assetAllocation.findFirst({
      where: { assetId, status: 'Active' },
    });

    if (!activeAllocation) {
      throw new Error('No active allocation found for this asset.');
    }

    const returned = await prisma.assetAllocation.update({
      where: { id: activeAllocation.id },
      data: {
        status: 'Returned',
        returnDate: new Date(),
        conditionOnIn,
      },
    });

    await prisma.asset.update({
      where: { id: assetId },
      data: { status: 'Available', currentHolderId: null, condition: conditionOnIn },
    });

    await HistoryService.logAction(assetId, 'Returned', performedBy, `Returned by ${activeAllocation.assignedTo}. Condition: ${conditionOnIn}`);
    
    return returned;
  }

  static async transferAsset(assetId: string, newAssignedTo: string, expectedReturn: Date | null, condition: string, performedBy: string) {
    // First return the asset, then allocate it
    const activeAllocation = await prisma.assetAllocation.findFirst({
      where: { assetId, status: 'Active' },
    });

    if (activeAllocation) {
      await this.returnAsset(assetId, condition, performedBy);
    }

    const newAllocation = await this.allocateAsset(assetId, newAssignedTo, expectedReturn, performedBy, condition);
    await HistoryService.logAction(assetId, 'Transferred', performedBy, `Transferred to ${newAssignedTo}`);
    
    return newAllocation;
  }
}
