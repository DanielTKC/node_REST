import {Router} from 'express';
import statesController from '../controllers/statesController.js';
import verifyStates from '../middleware/verifyStates.js';

const router = Router();

router.get('/',statesController.getStates);

// Get the State by params
router.route('/:state').get(verifyStates, statesController.getState);

// State Capitals
router.route('/:state/capital').get(verifyStates, statesController.getCapital);










export default router;