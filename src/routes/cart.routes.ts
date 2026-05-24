import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(authorize(['admin', 'client']));

router.get("/cart", cartController.getCartController);
router.post("/cart/items", cartController.addToCartController);
router.put("/cart/items/:productId", cartController.updateCartItemController);
router.delete("/cart/items/:productId", cartController.removeFromCartController);
router.delete("/cart", cartController.clearCartController);
router.post("/cart/checkout", cartController.checkoutController);

export default router;