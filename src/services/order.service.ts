// services/order.service.ts
import { PrismaClient, PaymentMethod, OrderStatus, PaymentStatus } from "@prisma/client";
const prisma = new PrismaClient();

interface CreateOrderInput {
  userId: string;
  products?: { productId: string; quantity: number }[];
  paymentMethod?: PaymentMethod;
  deliveryAddress: string;
  phoneNumber: string;
  deliveryNotes?: string;
}

export const createOrder = async (input: CreateOrderInput) => {
  const { userId, products, paymentMethod = PaymentMethod.CASH_ON_DELIVERY, deliveryAddress, phoneNumber, deliveryNotes } = input;
  
  if (!deliveryAddress || !phoneNumber) {
    throw new Error("L'adresse de livraison et le numéro de téléphone sont requis");
  }

  // Soit on utilise les produits fournis, soit on récupère le panier
  let orderItems = [];
  let total = 0;

  if (products && products.length > 0) {
    // Commande directe avec produits sélectionnés
    for (const p of products) {
      const product = await prisma.product.findUnique({ 
        where: { id: p.productId } 
      });
      
      if (!product) throw new Error(`Produit ${p.productId} introuvable`);
      if (product.stock < p.quantity) throw new Error(`Stock insuffisant pour ${product.name}`);

      total += product.price * p.quantity;
      orderItems.push({
        productId: p.productId,
        quantity: p.quantity,
        price: product.price,
      });
    }
  } else {
    // Commander depuis le panier
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { 
        items: { 
          include: { product: true } 
        } 
      }
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Le panier est vide");
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new Error(`Stock insuffisant pour ${item.product.name}`);
      }
      total += item.product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      });
    }
  }

  // Créer la commande
  const order = await prisma.$transaction(async (tx) => {
    // 1. Créer la commande
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        status: OrderStatus.PENDING,
        deliveryAddress,
        phoneNumber,
        deliveryNotes,
        items: {
          create: orderItems,
        },
      },
      include: { 
        items: { 
          include: { product: true } 
        } 
      },
    });

    // 2. Mettre à jour les stocks
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // 3. Si commande depuis panier, vider le panier
    if (!products) {
      await tx.cartItem.deleteMany({
        where: { cart: { userId } }
      });
    }

    return newOrder;
  });

  return order;
};

// Mettre à jour le statut de la commande
export const updateOrderStatus = async (
  orderId: string, 
  status: OrderStatus, 
  paymentStatus?: PaymentStatus
) => {
  const updateData: any = { status };
  
  if (paymentStatus) {
    updateData.paymentStatus = paymentStatus;
  }
  
  // Mettre à jour les dates selon le statut
  if (status === OrderStatus.PAID) {
    updateData.paidAt = new Date();
    updateData.paymentStatus = PaymentStatus.PAID;
  } else if (status === OrderStatus.SHIPPED) {
    updateData.shippedAt = new Date();
  } else if (status === OrderStatus.DELIVERED) {
    updateData.deliveredAt = new Date();
    updateData.paymentStatus = PaymentStatus.PAID; // Paiement à la livraison
  } else if (status === OrderStatus.CANCELLED) {
    // Restaurer le stock si la commande est annulée
    await restoreStock(orderId);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: { items: true }
  });
};

// Restaurer le stock en cas d'annulation
const restoreStock = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (order) {
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }
      });
    }
  }
};

// Obtenir les commandes par utilisateur
export const getUserOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: { 
      items: { 
        include: { product: true } 
      } 
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Obtenir une commande par ID
export const getOrderById = async (orderId: string, userId?: string) => {
  const where: any = { id: orderId };
  if (userId) {
    where.userId = userId; // Pour les clients normaux
  }
  
  return prisma.order.findFirst({
    where,
    include: { 
      items: { 
        include: { product: true } 
      } 
    }
  });
};