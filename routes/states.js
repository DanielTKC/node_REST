import {Router} from 'express';
import statesController from '../controllers/statesController.js';

const router = Router();

router.get('/',statesController.getStates);










export default router;