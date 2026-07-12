const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class WorkflowService {

  async allocateAsset(data, adminId) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Allocation
      const allocation = await tx.allocation.create({
        data: {
          assetId: parseInt(data.assetId),
          userId: parseInt(data.userId),
          departmentId: data.departmentId ? parseInt(data.departmentId) : null,
          allocatedDate: new Date(),
          status: 'ACTIVE'
        }
      });

      // 2. Update Asset Status
      await tx.asset.update({
        where: { id: parseInt(data.assetId) },
        data: { status: 'ALLOCATED', departmentId: allocation.departmentId }
      });

      // 3. Log Activity
      const adminExists = adminId ? await tx.user.findUnique({ where: { id: parseInt(adminId) } }) : null;
      await tx.activityLog.create({
        data: {
          action: 'ASSET_ALLOCATED',
          description: `Asset allocated to user ID ${data.userId}`,
          userId: adminExists ? parseInt(adminId) : null,
          assetId: parseInt(data.assetId)
        }
      });

      // 4. Send Notification to User
      await tx.notification.create({
        data: {
          userId: parseInt(data.userId),
          title: 'New Asset Assigned',
          message: `An asset has been assigned to you.`,
          type: 'SYSTEM',
          isRead: false
        }
      });

      return allocation;
    });
  }

  async reportMaintenance(data, requesterId) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Maintenance Request
      const request = await tx.maintenanceRequest.create({
        data: {
          assetId: parseInt(data.assetId),
          requesterId: parseInt(requesterId),
          issue: data.issue,
          status: 'PENDING'
        }
      });

      // 2. Update Asset Status
      await tx.asset.update({
        where: { id: parseInt(data.assetId) },
        data: { status: 'UNDER_MAINTENANCE' }
      });

      // 3. Log Activity
      const requesterExists = requesterId ? await tx.user.findUnique({ where: { id: parseInt(requesterId) } }) : null;
      await tx.activityLog.create({
        data: {
          action: 'MAINTENANCE_REQUESTED',
          description: `Maintenance reported: ${data.issue}`,
          userId: requesterExists ? parseInt(requesterId) : null,
          assetId: parseInt(data.assetId)
        }
      });

      return request;
    });
  }

  async createBooking(data, userId) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          assetId: parseInt(data.assetId),
          userId: parseInt(userId),
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          purpose: data.purpose,
          status: 'UPCOMING'
        }
      });

      const userExists = userId ? await tx.user.findUnique({ where: { id: parseInt(userId) } }) : null;
      await tx.activityLog.create({
        data: {
          action: 'ASSET_BOOKED',
          description: `Asset booked for ${data.purpose}`,
          userId: userExists ? parseInt(userId) : null,
          assetId: parseInt(data.assetId)
        }
      });

      return booking;
    });
  }
}

module.exports = new WorkflowService();
