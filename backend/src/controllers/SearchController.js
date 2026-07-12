const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SearchController {
  async globalSearch(req, res) {
    try {
      const q = req.query.q || '';
      if (q.length < 2) return res.json({ assets: [], users: [], departments: [] });

      const [assets, users, departments] = await Promise.all([
        prisma.asset.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { assetTag: { contains: q, mode: 'insensitive' } }
            ]
          },
          take: 5
        }),
        prisma.user.findMany({
          where: {
            OR: [
              { firstName: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } }
            ]
          },
          take: 5
        }),
        prisma.department.findMany({
          where: { name: { contains: q, mode: 'insensitive' } },
          take: 5
        })
      ]);

      res.json({ assets, users, departments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Search failed' });
    }
  }
}

module.exports = new SearchController();
