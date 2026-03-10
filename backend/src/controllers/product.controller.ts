import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { createProductSchema, updateProductSchema } from "../models/product.schema";

export const getProductsController = async (req: Request, res: Response) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filters = {
      search: req.query.search as string,
      category: req.query.category as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      sortBy: (req.query.sortBy as string) || "createdAt",
      order: (req.query.order as "asc" | "desc") || "desc"
    };

    const result = await productService.getAllProducts(page, limit, filters);

    return res.json(result);

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

export const createProductController = async (req: Request, res: Response) => {
  try {

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    const data = createProductSchema.parse(req.body);

    const image = req.file ? `/uploads/products/${req.file.filename}` : null;

    const product = await productService.createProduct({
      ...data,
      image,
    });

    return res.status(201).json(product);

  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

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

