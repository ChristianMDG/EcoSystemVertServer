import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createOrder = async (userId: string, products: { productId: string, quantity: number }[]) => {
  // Calculer le total de la commande
  let total = 0;
  const orderItemsData = [];

  for (const p of products) {
    const product = await prisma.product.findUnique({ where: { id: p.productId } });
    if (!product) throw new Error(`Produit ${p.productId} introuvable`);
    if (product.stock < p.quantity) throw new Error(`Stock insuffisant pour ${product.name}`);

    total += product.price * p.quantity;

    orderItemsData.push({
      productId: p.productId,
      quantity: p.quantity,
      price: product.price,
    });
  }

  // Créer la commande avec les items
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: orderItemsData,
      },
    },
    include: { items: { include: { product: true } } },
  });

  // Mettre à jour le stock
  for (const item of orderItemsData) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  return order;
};