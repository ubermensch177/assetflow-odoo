import { Router } from 'express';
import { getUsers, promote, changeStatus } from './user.controller';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';

const router = Router();

router.use(protect);

router.get('/', getUsers);

// Only ADMIN can promote or change status
router.put('/:id/promote', authorize('ADMIN'), promote);
router.put('/:id/status', authorize('ADMIN'), changeStatus);

export default router;
