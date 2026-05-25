import { Router } from "express";
import {
  adminGetAllQuotesController,
  adminUpdateQuoteStatusController
} from "../controllers/quote.controller";
import * as adminController from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.use(authMiddleware);
router.use(authorize(['admin']));

// ==================== DASHBOARD STATISTIQUES ====================
router.get("/admin/dashboard/stats", adminController.getDashboardStats);
router.get("/admin/dashboard/charts", adminController.getChartData);

// ==================== GESTION DES COMMANDES ====================
router.get("/admin/orders", adminController.getAllOrders);
router.get("/admin/orders/:id", adminController.getOrderDetails);
router.put("/admin/orders/:id/status", adminController.updateOrderStatus);
router.put("/admin/orders/:id/payment", adminController.updatePaymentStatus);
router.delete("/admin/orders/:id", adminController.deleteOrder);

// ==================== GESTION DES PRODUITS ====================
router.get("/admin/products", adminController.getAllProducts);
router.get("/admin/products/:id", adminController.getProductById);
router.post("/admin/products", upload.single('image'), adminController.createProduct);
router.put("/admin/products/:id", upload.single('image'), adminController.updateProduct);
router.delete("/admin/products/:id", adminController.deleteProduct);
router.put("/admin/products/:id/stock", adminController.updateStock);

// ==================== GESTION DES UTILISATEURS ====================
router.get("/admin/users", adminController.getAllUsers);
router.get("/admin/users/:id", adminController.getUserDetails);
router.put("/admin/users/:id/role", adminController.updateUserRole);
router.put("/admin/users/:id/status", adminController.toggleUserStatus);
router.delete("/admin/users/:id", adminController.deleteUser);



// ==================== GESTION DES DEVIS ====================
router.get("/admin/quotes", adminGetAllQuotesController);
router.patch("/admin/quotes/:id/status", adminUpdateQuoteStatusController);

export default router;