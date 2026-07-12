import prisma from '../../config/db';

export const createCategory = async (data: any, adminId: string) => {
  const { name, description, metadata } = data;
  
  const category = await prisma.category.create({
    data: { name, description, metadata }
  });

  await prisma.activityLog.create({
    data: {
      action: 'CREATE',
      entityType: 'Category',
      entityId: category.id,
      userId: adminId,
      details: { name }
    }
  });

  return category;
};

export const getCategories = async () => {
  return prisma.category.findMany();
};

export const updateCategory = async (id: string, data: any, adminId: string) => {
  const { status, name, description, metadata } = data;

  const category = await prisma.category.update({
    where: { id },
    data: { status, name, description, metadata }
  });

  await prisma.activityLog.create({
    data: {
      action: 'UPDATE',
      entityType: 'Category',
      entityId: id,
      userId: adminId,
      details: data
    }
  });

  return category;
};
