import {Router} from 'express';
import statesController from '../controllers/statesController.js';
import verifyStates from '../middleware/verifyStates.js';

const router = Router();

router.get('/',statesController.getStates);

// Get the State by params
router.route('/:state').get(verifyStates, statesController.getState);

// State Capitals
router.route('/:state/capital').get(verifyStates, statesController.getCapital);

// State nicknames
router.route('/:state/nickname').get(verifyStates, statesController.getNickname);

// State population
router.route('/:state/population').get(verifyStates, statesController.getPopulation);

// Admission date
router.route('/:state/admission').get(verifyStates, statesController.getAdmissionDate);

// fun facts
router.route('/:state/funfact')
  .get(verifyStates, statesController.getFunFact)
  .post(verifyStates, statesController.createFunFact);









export default router;