import prisma from "../config/prisma";

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const getAllProducts = async (
  page: number,
  limit: number,
  filters: ProductFilters
) => {

  const skip = (page - 1) * limit;

  const where: any = {};

  // 🔎 search par nom
  if (filters.search) {
    where.name = {
      contains: filters.search,
      mode: "insensitive"
    };
  }

  // 📂 category
  if (filters.category) {
    where.category = filters.category;
  }

  // 💰 price filter
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};

    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }

  const products = await prisma.product.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [filters.sortBy || "createdAt"]: filters.order
    }
  });

  const total = await prisma.product.count({ where });

  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
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