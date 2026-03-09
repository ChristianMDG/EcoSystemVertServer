import prisma from "../config/prisma";

export const getAllProducts = () => {
  return prisma.product.findMany();
};

export const getProductById = (id: string) => {
  return prisma.product.findUnique({ where: { id } });
};

// Création d'un produit (seulement admin)
export const createProduct = (data: any) => {
  return prisma.product.create({ data });
};

// Mise à jour d'un produit (seulement admin)
export const updateProduct = (id: string, data: any) => {
  return prisma.product.update({ where: { id }, data });
};

// Suppression d'un produit (seulement admin)
export const deleteProduct = (id: string) => {
  return prisma.product.delete({ where: { id } });
};