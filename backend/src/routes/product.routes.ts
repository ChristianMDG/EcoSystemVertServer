import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";
const router = Router();
router.use(authMiddleware);

router.get("/products" ,authorize(['admin', 'client']), productController.getProductsController);
router.get("/products/:id",authorize(['admin', 'client']), productController.getProductController);
router.post("/products", authorize(['admin']),upload.single("image"),productController.createProductController);
router.put("/products/:id", authorize(['admin']),productController.updateProductController);
router.delete("/products/:id",authorize(['admin']), productController.deleteProductController);

export default router;