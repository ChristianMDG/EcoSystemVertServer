// prisma/seed.ts
// EcoVert Mada - Seed complet

import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
  console.log("🌱 Seeding database...");

  // ========================================
  // CLEAN DATABASE
  // ========================================

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Database cleaned");

  // ========================================
  // PASSWORDS
  // ========================================

  const hashedPassword = await bcrypt.hash(
    "123456",
    SALT_ROUNDS
  );

  // ========================================
  // USERS
  // ========================================

  const admin = await prisma.user.create({
    data: {
      name: "EcoVert Admin",
      email: "admin@ecoverte.mg",
      password: hashedPassword,
      role: UserRole.admin,
    },
  });

  const client1 = await prisma.user.create({
    data: {
      name: "Rakoto Jean",
      email: "rakoto@example.com",
      password: hashedPassword,
      role: UserRole.client,
    },
  });

  const client2 = await prisma.user.create({
    data: {
      name: "Sarah Mada",
      email: "sarah@example.com",
      password: hashedPassword,
      role: UserRole.client,
    },
  });

  const client3 = await prisma.user.create({
    data: {
      name: "Ando Tech",
      email: "ando@example.com",
      password: hashedPassword,
      role: UserRole.client,
    },
  });

  console.log("👤 Users created");

  // ========================================
  // PRODUCTS
  // ========================================

  const products = await prisma.product.createMany({
    data: [
      {
        name: "Panneau Solaire 300W",
        description:
          "Panneau solaire haute performance pour maison écologique.",
        price: 850000,
        category: "Solar",
        stock: 12,
        image:
          "https://images.unsplash.com/photo-1509391366360-2e959784a276",
      },

      {
        name: "Batterie Solaire Lithium 5kWh",
        description:
          "Batterie lithium longue durée pour stockage d'énergie solaire.",
        price: 3200000,
        category: "Battery",
        stock: 8,
        image:
          "https://images.unsplash.com/photo-1592833159155-c62df1b65634",
      },

      {
        name: "Onduleur Hybride 5kVA",
        description:
          "Onduleur intelligent compatible panneaux solaires.",
        price: 1400000,
        category: "Inverter",
        stock: 5,
        image:
          "https://images.unsplash.com/photo-1497440001374-f26997328c1b",
      },

      {
        name: "Lampe Solaire LED",
        description:
          "Lampe économique rechargeable à énergie solaire.",
        price: 45000,
        category: "Lighting",
        stock: 50,
        image:
          "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
      },

      {
        name: "Pompe à Eau Solaire",
        description:
          "Pompe écologique idéale pour agriculture et irrigation.",
        price: 980000,
        category: "Agriculture",
        stock: 7,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
      },

      {
        name: "Chargeur Solaire Portable",
        description:
          "Chargeur portable pour téléphone et petits appareils.",
        price: 65000,
        category: "Accessories",
        stock: 30,
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475",
      },

      {
        name: "Kit Solaire Maison",
        description:
          "Kit complet pour alimenter une petite maison.",
        price: 4500000,
        category: "Solar Kit",
        stock: 3,
        image:
          "https://images.unsplash.com/photo-1497440001374-f26997328c1b",
      },

      {
        name: "Ventilateur Solaire",
        description:
          "Ventilateur économique alimenté par énergie solaire.",
        price: 120000,
        category: "Cooling",
        stock: 18,
        image:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216",
      },

      {
        name: "Chauffe-eau Solaire",
        description:
          "Système de chauffage d'eau écologique.",
        price: 2100000,
        category: "Heating",
        stock: 4,
        image:
          "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
      },

      {
        name: "Ampoule LED Éco",
        description:
          "Ampoule basse consommation très durable.",
        price: 15000,
        category: "Lighting",
        stock: 100,
        image:
          "https://images.unsplash.com/photo-1518005020951-eccb494ad742",
      },
    ],
  });

  console.log("📦 Products created");

  // ========================================
  // GET PRODUCTS
  // ========================================

  const allProducts = await prisma.product.findMany();

  // ========================================
  // CARTS
  // ========================================

  const cart1 = await prisma.cart.create({
    data: {
      userId: client1.id,
    },
  });

  const cart2 = await prisma.cart.create({
    data: {
      userId: client2.id,
    },
  });

  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart1.id,
        productId: allProducts[0].id,
        quantity: 2,
      },

      {
        cartId: cart1.id,
        productId: allProducts[3].id,
        quantity: 4,
      },

      {
        cartId: cart2.id,
        productId: allProducts[6].id,
        quantity: 1,
      },
    ],
  });

  console.log("🛒 Carts created");

  // ========================================
  // ORDERS
  // ========================================

  const order1 = await prisma.order.create({
    data: {
      total: 1790000,

      status: "DELIVERED",

      paymentMethod: "MOBILE_MONEY",

      paymentStatus: "PAID",

      paymentDate: new Date(),

      deliveryAddress: "Lot II M 45 Antananarivo",

      deliveryNotes: "Livrer avant 16h",

      phoneNumber: "0341234567",

      paidAt: new Date(),

      deliveredAt: new Date(),

      userId: client1.id,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      total: 4500000,

      status: "PROCESSING",

      paymentMethod: "BANK_TRANSFER",

      paymentStatus: "PAID",

      paymentDate: new Date(),

      deliveryAddress: "Fianarantsoa Centre",

      deliveryNotes: "Appeler avant livraison",

      phoneNumber: "0329876543",

      paidAt: new Date(),

      userId: client2.id,
    },
  });

  const order3 = await prisma.order.create({
    data: {
      total: 165000,

      status: "PENDING",

      paymentMethod: "CASH_ON_DELIVERY",

      paymentStatus: "PENDING",

      deliveryAddress: "Toamasina Madagascar",

      phoneNumber: "0331122334",

      userId: client3.id,
    },
  });

  console.log("🧾 Orders created");

  // ========================================
  // ORDER ITEMS
  // ========================================

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: allProducts[0].id,
        quantity: 2,
        price: 850000,
      },

      {
        orderId: order1.id,
        productId: allProducts[3].id,
        quantity: 2,
        price: 45000,
      },

      {
        orderId: order2.id,
        productId: allProducts[6].id,
        quantity: 1,
        price: 4500000,
      },

      {
        orderId: order3.id,
        productId: allProducts[5].id,
        quantity: 1,
        price: 65000,
      },

      {
        orderId: order3.id,
        productId: allProducts[9].id,
        quantity: 2,
        price: 15000,
      },
    ],
  });

  console.log("✅ Order items created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });