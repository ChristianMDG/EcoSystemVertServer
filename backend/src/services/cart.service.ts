import prisma from "../config/prisma";

export class CartService {
  // Get or create cart for user
  static async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    return cart;
  }

  // Add item to cart
  static async addItem(userId: string, productId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock. Available: ${product.stock}`);
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (existingItem) {
      // Update quantity if item exists
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new Error(`Insufficient stock. Available: ${product.stock}`);
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }

    return this.getOrCreateCart(userId);
  }

  // Update item quantity
  static async updateItemQuantity(userId: string, productId: string, quantity: number) {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock. Available: ${product.stock}`);
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId
          }
        }
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId
          }
        },
        data: { quantity }
      });
    }

    return this.getOrCreateCart(userId);
  }

  // Remove item from cart
  static async removeItem(userId: string, productId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    return this.getOrCreateCart(userId);
  }

  // Clear entire cart
  static async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    return this.getOrCreateCart(userId);
  }

  // Get cart total
  static async getCartTotal(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    return total;
  }

  // Checkout - convert cart to order
  static async checkout(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    
    if (cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Prepare order items from cart
    const orderItems = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Calculate total
    const total = orderItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );

    // Verify stock for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }
    }

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Update stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    return order;
  }
}