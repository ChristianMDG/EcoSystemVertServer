import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);

// Utiliser les bons noms
router.get("/orders",authorize(['admin', 'client']), orderController.getOrdersController);     
router.get("/orders/:id",authorize(['admin', 'client']), orderController.getOrderByIdController);    // GET une commande précise
router.post("/orders" ,authorize(['admin', 'client']), orderController.createOrderController);    
export default router;