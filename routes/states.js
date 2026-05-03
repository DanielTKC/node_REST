import {Router} from 'express';
import statesController from '../controllers/statesController.js';
import verifyStates from '../middleware/verifyStates.js';

const router = Router();

router.get('/',statesController.getStates);

router.route('/:state').get(verifyStates, statesController.getState);










export default router;