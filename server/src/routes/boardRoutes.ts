import { Router } from 'express';
import { updateBoardLocationController } from '../controllers/boardController';

const router = Router();

router.post('/update-location', updateBoardLocationController);

export default router;
