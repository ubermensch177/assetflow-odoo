import { Router } from 'express';
import { create, getAll, update } from './category.controller';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';

const router = Router();

router.use(protect);

router.get('/', getAll);

// Only ADMIN can create and update categories
router.post('/', authorize('ADMIN'), create);
router.put('/:id', authorize('ADMIN'), update);

export default router;
