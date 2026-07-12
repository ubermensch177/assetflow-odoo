const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SearchController {
  async globalSearch(req, res) {
    try {
      const q = req.query.q || '';
      if (q.length < 2) return res.json({ assets: [], users: [], departments: [] });

      const terms = q.split(' ').filter(Boolean);
      if (terms.length === 0) return res.json({ assets: [], users: [], departments: [] });

      const assetConditions = terms.map(term => ({
        OR: [
          { name: { contains: term } },
          { assetTag: { contains: term } }
        ]
      }));

      const userConditions = terms.map(term => ({
        OR: [
          { firstName: { contains: term } },
          { lastName: { contains: term } },
          { email: { contains: term } }
        ]
      }));

      const deptConditions = terms.map(term => ({
        name: { contains: term }
      }));

      const [assets, users, departments] = await Promise.all([
        prisma.asset.findMany({
          where: { AND: assetConditions },
          take: 5
        }),
        prisma.user.findMany({
          where: { AND: userConditions },
          take: 5
        }),
        prisma.department.findMany({
          where: { AND: deptConditions },
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
