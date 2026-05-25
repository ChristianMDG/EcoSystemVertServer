import { Request, Response } from "express";
import prisma from "../config/prisma";
import { OrderStatus, PaymentStatus, UserRole } from "@prisma/client";
import fs from 'fs';
import path from 'path';

// ==================== DASHBOARD STATISTIQUES ====================
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      pendingOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } }
        }
      }),
      prisma.order.count({
        where: { status: "PENDING" }
      }),
      prisma.product.count({
        where: { stock: { lt: 10 } }
      }),
    ]);

    return res.json({
      success: true,
      data: {
        users: totalUsers,
        products: totalProducts,
        orders: totalOrders,
        revenue: totalRevenue._sum.total || 0,
        pendingOrders,
        lowStockProducts,
        recentOrders
      }
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getChartData = async (req: Request, res: Response) => {
  try {
    console.log('📊 getChartData - Début');
    console.log('📊 Period:', req.query.period);
    
    // Version ultra simple pour tester
    const orderStatusStats = await prisma.order.groupBy({
      by: ['status'],
      _count: true
    });
    
    console.log('✅ orderStatusStats:', orderStatusStats);

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });
    
    console.log('✅ topProducts:', topProducts);

    return res.json({
      success: true,
      data: {
        ordersByPeriod: [],
        orderStatusStats,
        topProducts
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur détaillée getChartData:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.stack
    });
  }
};
// ==================== GESTION DES COMMANDES ====================
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: { contains: search as string, mode: 'insensitive' } },
        { user: { name: { contains: search as string, mode: 'insensitive' } } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: {
            include: { product: { select: { name: true, price: true } } }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    return res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: "Commande non trouvée" });
    }

    return res.json({ success: true, data: order });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateData: any = { status };
    
    if (status === OrderStatus.PAID) {
      updateData.paidAt = new Date();
      updateData.paymentStatus = PaymentStatus.PAID;
    } else if (status === OrderStatus.SHIPPED) {
      updateData.shippedAt = new Date();
    } else if (status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { user: true }
    });

    return res.json({
      success: true,
      message: "Statut mis à jour avec succès",
      data: order
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus }
    });

    return res.json({
      success: true,
      message: "Statut de paiement mis à jour",
      data: order
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true }
      });

      if (order) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          });
        }
      }

      await tx.order.delete({ where: { id } });
    });

    return res.json({
      success: true,
      message: "Commande supprimée avec succès"
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GESTION DES PRODUITS ====================
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    // Ajouter l'URL complète pour les images
    const productsWithImageUrl = products.map(product => ({
      ...product,
      imageUrl: product.image ? `${req.protocol}://${req.get('host')}/uploads/${product.image}` : null
    }));

    return res.json({
      success: true,
      data: {
        products: productsWithImageUrl,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ success: false, error: "Produit non trouvé" });
    }

    const productWithImageUrl = {
      ...product,
      imageUrl: product.image ? `${req.protocol}://${req.get('host')}/uploads/${product.image}` : null
    };

    return res.json({ success: true, data: productWithImageUrl });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        image
      }
    });

    const productWithImageUrl = {
      ...product,
      imageUrl: product.image ? `${req.protocol}://${req.get('host')}/uploads/${product.image}` : null
    };

    return res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      data: productWithImageUrl
    });

  } catch (error: any) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ success: false, error: "Produit non trouvé" });
    }

    if (req.file && existingProduct.image) {
      const oldImagePath = path.join('uploads', existingProduct.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const image = req.file ? req.file.filename : existingProduct.image;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        price: price ? parseFloat(price) : undefined,
        category: category || undefined,
        stock: stock ? parseInt(stock) : undefined,
        image
      }
    });

    const productWithImageUrl = {
      ...product,
      imageUrl: product.image ? `${req.protocol}://${req.get('host')}/uploads/${product.image}` : null
    };

    return res.json({
      success: true,
      message: "Produit mis à jour avec succès",
      data: productWithImageUrl
    });

  } catch (error: any) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ success: false, error: "Produit non trouvé" });
    }

    if (product.image) {
      const imagePath = path.join('uploads', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.product.delete({ where: { id } });

    return res.json({
      success: true,
      message: "Produit supprimé avec succès"
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: { stock: parseInt(stock) }
    });

    return res.json({
      success: true,
      message: "Stock mis à jour",
      data: product
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== GESTION DES UTILISATEURS ====================
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        }
      }),
      prisma.user.count({ where })
    ]);

    return res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "Utilisateur non trouvé" });
    }

    return res.json({ success: true, data: user });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ success: false, error: "Rôle invalide" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });

    return res.json({
      success: true,
      message: "Rôle utilisateur mis à jour",
      data: user
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "Utilisateur non trouvé" });
    }

    // Note: Vous devez ajouter le champ isActive à votre modèle User
    // Pour l'instant, on simule
    console.log(`🔄 Changement statut utilisateur ${id} : ${isActive ? 'activé' : 'désactivé'}`);

    return res.json({
      success: true,
      message: `Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`,
      data: { id, isActive }
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    return res.json({
      success: true,
      message: "Utilisateur supprimé avec succès"
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
