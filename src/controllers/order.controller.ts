// controllers/order.controller.ts
import { Request, Response } from "express";
import * as orderService from "../services/order.service";
import { PaymentMethod, OrderStatus } from "@prisma/client";

// Créer une commande
export const createOrderController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const { 
      products, 
      paymentMethod = PaymentMethod.CASH_ON_DELIVERY,
      deliveryAddress,
      phoneNumber,
      deliveryNotes 
    } = req.body;

    // Validation des champs requis
    if (!deliveryAddress || !phoneNumber) {
      return res.status(400).json({ 
        error: "L'adresse de livraison et le numéro de téléphone sont requis" 
      });
    }

    const order = await orderService.createOrder({
      userId: req.user.userId,
      products,
      paymentMethod,
      deliveryAddress,
      phoneNumber,
      deliveryNotes
    });

    return res.status(201).json({
      success: true,
      message: "Commande créée avec succès. Paiement à la livraison.",
      data: order
    });

  } catch (err: any) {
    return res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Obtenir toutes les commandes de l'utilisateur
export const getOrdersController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const orders = await orderService.getUserOrders(req.user.userId);

    return res.json({
      success: true,
      data: orders
    });

  } catch (err: any) {
    return res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Obtenir une commande par ID
export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId, req.user.userId);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: "Commande non trouvée" 
      });
    }

    return res.json({
      success: true,
      data: order
    });

  } catch (err: any) {
    return res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Pour les administrateurs - Mettre à jour le statut d'une commande
export const updateOrderStatusController = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await orderService.updateOrderStatus(id, status, paymentStatus);

    return res.json({
      success: true,
      message: "Statut de la commande mis à jour",
      data: order
    });

  } catch (err: any) {
    return res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Annuler une commande
export const cancelOrderController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const { id } = req.params;
    const order = await orderService.getOrderById(id, req.user.userId);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: "Commande non trouvée" 
      });
    }

    // Vérifier si la commande peut être annulée
    if (order.status !== OrderStatus.PENDING) {
      return res.status(400).json({ 
        success: false,
        error: "Seules les commandes en attente peuvent être annulées" 
      });
    }

    const cancelledOrder = await orderService.updateOrderStatus(
      id, 
      OrderStatus.CANCELLED
    );

    return res.json({
      success: true,
      message: "Commande annulée avec succès",
      data: cancelledOrder
    });

  } catch (err: any) {
    return res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};