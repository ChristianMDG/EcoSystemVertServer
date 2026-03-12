import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

export const getCartController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cart = await CartService.getOrCreateCart(req.user.userId);
    const total = await CartService.getCartTotal(req.user.userId);

    return res.json({
      success: true,
      data: {
        ...cart,
        total
      }
    });
  } catch (err: any) {
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const addToCartController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        error: "Product ID is required" 
      });
    }

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        error: "Quantity must be at least 1" 
      });
    }

    const cart = await CartService.addItem(req.user.userId, productId, quantity);
    const total = await CartService.getCartTotal(req.user.userId);

    return res.json({
      success: true,
      data: {
        ...cart,
        total
      }
    });
  } catch (err: any) {
    return res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const updateCartItemController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: "Quantity is required" 
      });
    }

    const cart = await CartService.updateItemQuantity(
      req.user.userId,
      productId,
      quantity
    );
    const total = await CartService.getCartTotal(req.user.userId);

    return res.json({
      success: true,
      data: {
        ...cart,
        total
      }
    });
  } catch (err: any) {
    return res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const removeFromCartController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productId } = req.params;

    const cart = await CartService.removeItem(req.user.userId, productId);
    const total = await CartService.getCartTotal(req.user.userId);

    return res.json({
      success: true,
      data: {
        ...cart,
        total
      }
    });
  } catch (err: any) {
    return res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const clearCartController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cart = await CartService.clearCart(req.user.userId);
    return res.json({
      success: true,
      data: {
        ...cart,
        total: 0
      }
    });
  } catch (err: any) {
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const checkoutController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { deliveryAddress, phoneNumber, deliveryNotes } = req.body;

    // Validation des champs requis
    if (!deliveryAddress || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "Delivery address and phone number are required"
      });
    }

    const order = await CartService.checkout(
      req.user.userId, 
      deliveryAddress, 
      phoneNumber, 
      deliveryNotes
    );
    
    return res.status(201).json({
      success: true,
      message: "Order created successfully with Cash on Delivery",
      data: order
    });
  } catch (err: any) {
    return res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
};