import prisma from '../../config/db';

export const getAllUsers = async (filters: any) => {
  return prisma.user.findMany({
    where: filters,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      department: { select: { id: true, name: true } },
      createdAt: true,
    }
  });
};

export const promoteUser = async (userId: string, newRole: any, adminId: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  await prisma.activityLog.create({
    data: {
      action: 'PROMOTE',
      entityType: 'User',
      entityId: userId,
      userId: adminId,
      details: { newRole }
    }
  });

  return user;
};

export const toggleUserStatus = async (userId: string, status: any, adminId: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status }
  });

  await prisma.activityLog.create({
    data: {
      action: 'UPDATE_STATUS',
      entityType: 'User',
      entityId: userId,
      userId: adminId,
      details: { status }
    }
  });

  return user;
};
