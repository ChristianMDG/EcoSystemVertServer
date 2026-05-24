import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import {
  createSimulation,
  getUserSimulations,
  getSimulationById,
  deleteSimulation,
  getUserStats,
  addSimulationFeedback
} from '../controllers/energy.controller.js';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);
router.use(authorize(['admin', 'client']));

// Routes principales
router.post('/simulations', createSimulation);
router.get('/simulations', getUserSimulations);
router.get('/simulations/stats', getUserStats);
router.get('/simulations/:id', getSimulationById);
router.delete('/simulations/:id', deleteSimulation);

// Feedback
router.post('/simulations/:simulationId/feedback', addSimulationFeedback);

export default router;