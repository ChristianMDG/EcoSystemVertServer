
import  { Request, Response } from "express";
import * as orderService from "../services/order.service";
import prisma from "../config/prisma";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const userId = req.user.userId;
    const products = req.body.products;
    const order = await orderService.createOrder(userId, products);
   return res.status(201).json(order);
  } catch (err: any) {
   return res.status(400).json({ error: err.message });
  }
};

export const getOrdersController = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const userId = req.user.userId;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    return res.json(orders);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};


export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const userId = req.user.userId;
    const orderId = req.params.id;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId, 
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    return res.json(order);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};