// src/models/cart.schema.ts
import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  quantity: z.number().int().positive().optional().default(1)
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, "Quantity must be 0 or greater")
});