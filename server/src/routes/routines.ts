import { Router } from 'express';
import { routineController } from '../controllers/routineController';

const router = Router();

router.get('/', routineController.getRoutines);
router.get('/top', routineController.getTopRoutines);
router.get('/:id', routineController.getRoutineById);
router.get('/:id/items', routineController.getRoutineItems);

export default router;
