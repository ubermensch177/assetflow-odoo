const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const { authenticateToken, JWT_SECRET } = require('./middlewares/auth');
const { requireRole } = require('./middlewares/rbac');
const assetRoutes = require('./routes/assetRoutes');
const searchRoutes = require('./routes/searchRoutes');

// ------------------------------------------------------------
// AUTH
// ------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'EMPLOYEE'
      }
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ------------------------------------------------------------
// ROUTERS (Refactored Thin Controllers)
// ------------------------------------------------------------
app.use('/api', assetRoutes);
app.use('/api', searchRoutes);

// ------------------------------------------------------------
// ORGANIZATION SETUP
// ------------------------------------------------------------
app.get('/api/departments', authenticateToken, requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD']), async (req, res) => {
  const depts = await prisma.department.findMany({ include: { head: true } });
  res.json(depts);
});

app.post('/api/departments', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const dept = await prisma.department.create({ data: { name: req.body.name, headId: req.body.headId ? parseInt(req.body.headId) : null } });
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ error: "Failed to create department" });
  }
});

app.put('/api/departments/:id', authenticateToken, requireRole(['ADMIN', 'ASSET_MANAGER']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await prisma.department.update({
      where: { id: parseInt(id) },
      data: { name },
      include: { head: true }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update department' });
  }
});

app.delete('/api/departments/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.department.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

app.get('/api/users', authenticateToken, requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD']), async (req, res) => {
  const users = await prisma.user.findMany({ include: { department: true } });
  res.json(users);
});

app.post('/api/users', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        passwordHash: hashedPassword,
        role: req.body.role || 'EMPLOYEE',
        departmentId: req.body.departmentId ? parseInt(req.body.departmentId) : null
      }
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.put('/api/users/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, role } = req.body;
    const data = {};
    if (firstName) data.firstName = firstName;
    if (role) data.role = role;
    
    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data,
      include: { department: true }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.get('/api/categories', authenticateToken, async (req, res) => {
  const cats = await prisma.assetCategory.findMany();
  res.json(cats);
});

app.post('/api/categories', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const cat = await prisma.assetCategory.create({ data: { name: req.body.name, description: req.body.description || '' } });
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.put('/api/categories/:id', authenticateToken, requireRole(['ADMIN', 'ASSET_MANAGER']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await prisma.assetCategory.update({
      where: { id: parseInt(id) },
      data: { name }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', authenticateToken, requireRole(['ADMIN', 'ASSET_MANAGER']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.assetCategory.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ------------------------------------------------------------
// NOTIFICATIONS
// ------------------------------------------------------------
app.get('/api/notifications', authenticateToken, async (req, res) => {
  const notifs = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  res.json(notifs);
});

// ------------------------------------------------------------
// BOOKINGS
// ------------------------------------------------------------
app.get('/api/bookings', authenticateToken, async (req, res) => {
  const whereClause = req.user.role === 'EMPLOYEE' ? { userId: req.user.id } : {};
  const bookings = await prisma.booking.findMany({
    where: whereClause,
    include: { asset: true, user: true },
    orderBy: { startTime: 'desc' },
    take: 50
  });
  res.json(bookings);
});

app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const WorkflowService = require('./services/WorkflowService');
    const booking = await WorkflowService.createBooking(req.body, req.user.id);
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// ------------------------------------------------------------
// MAINTENANCE
// ------------------------------------------------------------
app.get('/api/maintenance', authenticateToken, async (req, res) => {
  const whereClause = req.user.role === 'EMPLOYEE' ? { requesterId: req.user.id } : {};
  const requests = await prisma.maintenanceRequest.findMany({
    where: whereClause,
    include: { asset: true, requester: true },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json(requests);
});

app.post('/api/maintenance', authenticateToken, async (req, res) => {
  try {
    const WorkflowService = require('./services/WorkflowService');
    const reqData = await WorkflowService.reportMaintenance(req.body, req.user.id);
    res.status(201).json(reqData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create maintenance request' });
  }
});

// ------------------------------------------------------------
// AUDITS
// ------------------------------------------------------------
app.get('/api/audits', authenticateToken, requireRole(['ADMIN', 'ASSET_MANAGER']), async (req, res) => {
  const audits = await prisma.auditCycle.findMany({
    include: { assignedTo: true, records: { include: { asset: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(audits);
});

app.post('/api/audits', authenticateToken, requireRole(['ADMIN', 'ASSET_MANAGER']), async (req, res) => {
  try {
    const audit = await prisma.auditCycle.create({
      data: {
        name: req.body.name,
        assignedToId: req.body.assignedToId ? parseInt(req.body.assignedToId) : req.user.id,
        startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
        status: req.body.status || 'OPEN'
      }
    });
    res.status(201).json(audit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create audit' });
  }
});

app.delete('/api/audits/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    // First delete associated audit records
    await prisma.auditRecord.deleteMany({
      where: { auditCycleId: parseInt(id) }
    });
    await prisma.auditCycle.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete audit' });
  }
});

// ------------------------------------------------------------
// DASHBOARD KPIs (To be refactored)
// ------------------------------------------------------------
app.get('/api/dashboard/kpis', authenticateToken, async (req, res) => {
  const totalAssets = await prisma.asset.count();
  const availableAssets = await prisma.asset.count({ where: { status: 'AVAILABLE', isBookable: false } });
  const allocatedAssets = await prisma.asset.count({ where: { status: 'ALLOCATED' } });
  const maintenanceAssets = await prisma.asset.count({ where: { status: 'UNDER_MAINTENANCE' } });
  const activeBookings = await prisma.booking.count({ where: { status: 'ONGOING' } });
  
  res.json({
    totalAssets,
    availableAssets,
    allocatedAssets,
    maintenanceAssets,
    activeBookings,
    pendingTransfers: 0
  });
});

app.get('/api/dashboard/activities', authenticateToken, async (req, res) => {
  const activities = await prisma.activityLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true, asset: true }
  });
  res.json(activities);
});

// ------------------------------------------------------------
// REPORTS & ANALYTICS (To be refactored)
// ------------------------------------------------------------
app.get('/api/reports/analytics', authenticateToken, requireRole(['ADMIN', 'ASSET_MANAGER', 'DEPT_HEAD']), async (req, res) => {
  try {
    const ReportService = require('./services/ReportService');
    const analytics = await ReportService.getEnterpriseAnalytics();
    res.json(analytics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
