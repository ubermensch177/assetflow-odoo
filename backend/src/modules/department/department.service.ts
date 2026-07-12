import prisma from '../../config/db';

export const createDepartment = async (data: any, adminId: string) => {
  const { name, parentId, headId } = data;
  
  const department = await prisma.department.create({
    data: { name, parentId, headId }
  });

  await prisma.activityLog.create({
    data: {
      action: 'CREATE',
      entityType: 'Department',
      entityId: department.id,
      userId: adminId,
      details: { name }
    }
  });

  return department;
};

export const getDepartments = async () => {
  return prisma.department.findMany({
    include: {
      head: { select: { id: true, firstName: true, lastName: true } },
      parent: { select: { id: true, name: true } },
      _count: { select: { employees: true } }
    }
  });
};

export const updateDepartment = async (id: string, data: any, adminId: string) => {
  const { status, headId, name, parentId } = data;

  const department = await prisma.department.update({
    where: { id },
    data: { status, headId, name, parentId }
  });

  await prisma.activityLog.create({
    data: {
      action: 'UPDATE',
      entityType: 'Department',
      entityId: id,
      userId: adminId,
      details: data
    }
  });

  return department;
};
