// routes/order.routes.ts
import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Routes client
router.get("/orders", authorize(['admin', 'client']), orderController.getOrdersController);
router.get("/orders/:id", authorize(['admin', 'client']), orderController.getOrderByIdController);
router.post("/orders", authorize(['admin', 'client']), orderController.createOrderController);
router.post("/orders/:id/cancel", authorize(['admin', 'client']), orderController.cancelOrderController);

// Routes admin uniquement
router.put("/orders/:id/status", authorize(['admin']), orderController.updateOrderStatusController);

export default router;