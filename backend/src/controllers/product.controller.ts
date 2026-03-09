import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { createProductSchema, updateProductSchema } from "../models/product.schema";

export const getProductsController = async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    return res.json(products);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getProductController = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    return res.json(product);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

// Création d'un produit (admin uniquement)
export const createProductController = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const data = createProductSchema.parse(req.body);
    const product = await productService.createProduct(data);
    return res.status(201).json(product);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

// Mise à jour d'un produit (admin uniquement)
export const updateProductController = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const data = updateProductSchema.parse(req.body);
    const product = await productService.updateProduct(req.params.id, data);
    return res.json(product);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

// Suppression d'un produit (admin uniquement)
export const deleteProductController = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    await productService.deleteProduct(req.params.id);
    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

