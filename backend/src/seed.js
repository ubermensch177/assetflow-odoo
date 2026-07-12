const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditRecord.deleteMany();
  await prisma.auditCycle.deleteMany();
  await prisma.maintenanceRequest.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.allocation.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.assetCategory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log('Seeding Departments...');
  const deptNames = ['IT', 'HR', 'Finance', 'Operations', 'Sales', 'Marketing', 'Legal', 'Engineering'];
  const departments = [];
  for (const name of deptNames) {
    const dept = await prisma.department.create({
      data: { name }
    });
    departments.push(dept);
  }

  console.log('Seeding Users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = [];

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@assetflow.com',
      password: passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      role: 'ADMIN',
      departmentId: departments[0].id
    }
  });
  users.push(admin);

  // Generate 250 Employees (some Asset Managers, some Dept Heads)
  for (let i = 0; i < 250; i++) {
    const roleRand = Math.random();
    let role = 'EMPLOYEE';
    if (roleRand > 0.95) role = 'ASSET_MANAGER';
    else if (roleRand > 0.9) role = 'DEPT_HEAD';

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: passwordHash,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role,
        departmentId: departments[Math.floor(Math.random() * departments.length)].id
      }
    });
    users.push(user);
  }

  console.log('Seeding Asset Categories...');
  const categoryNames = ['Electronics', 'Furniture', 'Vehicles', 'Machinery', 'Medical Equipment'];
  const categories = [];
  for (const name of categoryNames) {
    const cat = await prisma.assetCategory.create({
      data: { name }
    });
    categories.push(cat);
  }

  console.log('Seeding Assets (250 items + 50 Shared Resources)...');
  const assets = [];
  for (let i = 0; i < 300; i++) {
    const isBookable = i >= 250; // Last 50 are shared resources
    let category, name;
    
    if (isBookable) {
      category = categories.find(c => ['Vehicles', 'Electronics'].includes(c.name)) || categories[0];
      name = faker.helpers.arrayElement(['Meeting Room Projector', 'Conference Room Display', 'Company Van', 'Shared DSLR', 'Presentation Laptop']);
    } else {
      category = categories[Math.floor(Math.random() * categories.length)];
      name = faker.commerce.productName();
    }

    const asset = await prisma.asset.create({
      data: {
        assetTag: `TAG-${faker.string.alphanumeric(8).toUpperCase()}`,
        serialNumber: faker.string.uuid(),
        name,
        categoryId: category.id,
        departmentId: Math.random() > 0.5 ? departments[Math.floor(Math.random() * departments.length)].id : null,
        vendor: faker.company.name(),
        supplier: faker.company.name(),
        purchaseCost: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
        purchaseDate: faker.date.past({ years: 3 }),
        warrantyExpiry: faker.date.future({ years: 2 }),
        expectedLifetime: faker.number.int({ min: 12, max: 60 }),
        condition: faker.helpers.arrayElement(['NEW', 'GOOD', 'FAIR', 'POOR']),
        status: isBookable ? 'AVAILABLE' : faker.helpers.arrayElement(['AVAILABLE', 'ALLOCATED', 'ALLOCATED', 'UNDER_MAINTENANCE']),
        isBookable
      }
    });
    assets.push(asset);
  }

  console.log('Seeding Allocations (100+)...');
  const allocatedAssets = assets.filter(a => a.status === 'ALLOCATED');
  for (const asset of allocatedAssets) {
    const userId = users[Math.floor(Math.random() * users.length)].id;
    await prisma.allocation.create({
      data: {
        assetId: asset.id,
        userId: userId,
        allocatedDate: faker.date.recent({ days: 100 }),
        status: 'ACTIVE'
      }
    });

    await prisma.activityLog.create({
      data: {
        userId,
        assetId: asset.id,
        action: 'ALLOCATED',
        description: `Asset ${asset.assetTag} allocated to user.`,
        currentState: 'ALLOCATED'
      }
    });
  }

  console.log('Seeding Bookings (60+)...');
  const bookableAssets = assets.filter(a => a.isBookable);
  for (let i = 0; i < 65; i++) {
    const asset = bookableAssets[Math.floor(Math.random() * bookableAssets.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    await prisma.booking.create({
      data: {
        assetId: asset.id,
        userId: user.id,
        startTime: faker.date.soon({ days: 10 }),
        endTime: faker.date.soon({ days: 12 }),
        purpose: faker.company.catchPhrase(),
        status: faker.helpers.arrayElement(['UPCOMING', 'ONGOING', 'COMPLETED'])
      }
    });
  }

  console.log('Seeding Maintenance Requests (30+)...');
  const maintenanceAssets = assets.filter(a => a.status === 'UNDER_MAINTENANCE' || Math.random() > 0.8);
  for (let i = 0; i < 35; i++) {
    const asset = maintenanceAssets[Math.floor(Math.random() * maintenanceAssets.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const status = asset.status === 'UNDER_MAINTENANCE' ? 'IN_PROGRESS' : faker.helpers.arrayElement(['RESOLVED', 'PENDING']);
    
    await prisma.maintenanceRequest.create({
      data: {
        assetId: asset.id,
        requesterId: user.id,
        issue: faker.hacker.phrase(),
        status,
        cost: status === 'RESOLVED' ? parseFloat(faker.commerce.price({ min: 50, max: 1000 })) : null,
        resolvedAt: status === 'RESOLVED' ? faker.date.recent() : null
      }
    });
  }

  console.log('Seeding Audits (5 Cycles)...');
  for (let i = 0; i < 5; i++) {
    const auditor = users.find(u => u.role === 'ASSET_MANAGER') || admin;
    const cycle = await prisma.auditCycle.create({
      data: {
        name: `Q${(i % 4) + 1} Audit 202${3 + Math.floor(i / 4)}`,
        status: i === 4 ? 'OPEN' : 'CLOSED',
        assignedToId: auditor.id,
        startDate: faker.date.past(),
        endDate: i === 4 ? null : faker.date.recent()
      }
    });

    const auditAssets = faker.helpers.arrayElements(assets, 50);
    for (const asset of auditAssets) {
      await prisma.auditRecord.create({
        data: {
          auditCycleId: cycle.id,
          assetId: asset.id,
          status: i === 4 ? 'PENDING' : faker.helpers.arrayElement(['VERIFIED', 'VERIFIED', 'MISSING', 'DAMAGED'])
        }
      });
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
