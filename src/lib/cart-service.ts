import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cart Item Types
export const CartItemType = {
  SPP: 'SPP',
  DONATION: 'DONATION',
  PRODUCT: 'PRODUCT',
  SERVICE: 'SERVICE',
  EVENT: 'EVENT',
  BOOK: 'BOOK'
} as const;

interface CartItem {
  id?: string;
  cartId: string;
  userId?: string;
  itemType: string;
  itemId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  metadata?: Record<string, any>;
}

interface CartSummary {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}

export class CartService {
  
  // Add item to cart
  static async addToCart(cartId: string, item: Omit<CartItem, 'id' | 'cartId'>): Promise<CartItem> {
    try {
      // Check if item already exists in cart
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId,
          itemType: item.itemType,
          itemId: item.itemId
        }
      });

      if (existingItem) {
        // Update quantity if item exists
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + item.quantity,
            price: item.price, // Update price in case it changed
            updatedAt: new Date()
          }
        });

        return this.formatCartItem(updatedItem);
      } else {
        // Create new cart item
        const newItem = await prisma.cartItem.create({
          data: {
            cartId,
            userId: item.userId,
            itemType: item.itemType,
            itemId: item.itemId,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            metadata: item.metadata ? JSON.stringify(item.metadata) : null
          }
        });

        return this.formatCartItem(newItem);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  // Remove item from cart
  static async removeFromCart(cartId: string, itemId: string): Promise<boolean> {
    try {
      await prisma.cartItem.deleteMany({
        where: {
          cartId,
          id: itemId
        }
      });

      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }

  // Update item quantity
  static async updateQuantity(cartId: string, itemId: string, quantity: number): Promise<CartItem | null> {
    try {
      if (quantity <= 0) {
        await this.removeFromCart(cartId, itemId);
        return null;
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: itemId },
        data: {
          quantity,
          updatedAt: new Date()
        }
      });

      return this.formatCartItem(updatedItem);
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  }

  // Get cart items
  static async getCartItems(cartId: string): Promise<CartItem[]> {
    try {
      const items = await prisma.cartItem.findMany({
        where: { cartId },
        orderBy: { createdAt: 'asc' }
      });

      return items.map(item => this.formatCartItem(item));
    } catch (error) {
      console.error('Error getting cart items:', error);
      throw error;
    }
  }

  // Get cart summary
  static async getCartSummary(cartId: string): Promise<CartSummary> {
    try {
      const items = await this.getCartItems(cartId);
      
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = this.calculateTax(subtotal);
      const discount = await this.calculateDiscount(cartId, subtotal);
      const total = subtotal + tax - discount;
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items,
        subtotal,
        tax,
        discount,
        total,
        itemCount
      };
    } catch (error) {
      console.error('Error getting cart summary:', error);
      throw error;
    }
  }

  // Clear cart
  static async clearCart(cartId: string): Promise<boolean> {
    try {
      await prisma.cartItem.deleteMany({
        where: { cartId }
      });

      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Merge guest cart with user cart
  static async mergeCart(guestCartId: string, userCartId: string): Promise<boolean> {
    try {
      const guestItems = await prisma.cartItem.findMany({
        where: { cartId: guestCartId }
      });

      for (const guestItem of guestItems) {
        // Check if item exists in user cart
        const existingUserItem = await prisma.cartItem.findFirst({
          where: {
            cartId: userCartId,
            itemType: guestItem.itemType,
            itemId: guestItem.itemId
          }
        });

        if (existingUserItem) {
          // Update quantity
          await prisma.cartItem.update({
            where: { id: existingUserItem.id },
            data: {
              quantity: existingUserItem.quantity + guestItem.quantity,
              updatedAt: new Date()
            }
          });
        } else {
          // Move item to user cart
          await prisma.cartItem.update({
            where: { id: guestItem.id },
            data: {
              cartId: userCartId,
              updatedAt: new Date()
            }
          });
        }
      }

      // Clear guest cart
      await this.clearCart(guestCartId);

      return true;
    } catch (error) {
      console.error('Error merging carts:', error);
      throw error;
    }
  }

  // Add SPP payment to cart
  static async addSPPToCart(cartId: string, studentId: string, userId?: string): Promise<CartItem> {
    try {
      // Get student info
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: { id: true, name: true, nis: true }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Get SPP amount (you might want to get this from a settings table)
      const sppAmount = await this.getSPPAmount(studentId);
      const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

      return await this.addToCart(cartId, {
        userId,
        itemType: CartItemType.SPP,
        itemId: studentId,
        name: `SPP ${student.name} - ${currentMonth}`,
        description: `Pembayaran SPP untuk ${student.name} (${student.nis}) bulan ${currentMonth}`,
        price: sppAmount,
        quantity: 1,
        metadata: {
          studentId,
          studentName: student.name,
          studentNis: student.nis,
          period: currentMonth,
          type: 'monthly_spp'
        }
      });
    } catch (error) {
      console.error('Error adding SPP to cart:', error);
      throw error;
    }
  }

  // Add donation to cart
  static async addDonationToCart(
    cartId: string, 
    donationType: string, 
    amount: number, 
    message?: string,
    userId?: string
  ): Promise<CartItem> {
    try {
      const donationTypes = {
        general: 'Donasi Umum',
        building: 'Donasi Pembangunan',
        scholarship: 'Donasi Beasiswa',
        equipment: 'Donasi Peralatan',
        books: 'Donasi Buku'
      };

      const donationName = donationTypes[donationType as keyof typeof donationTypes] || 'Donasi';

      return await this.addToCart(cartId, {
        userId,
        itemType: CartItemType.DONATION,
        itemId: `donation_${donationType}_${Date.now()}`,
        name: donationName,
        description: message || `${donationName} untuk TPQ Baitus Shuffah`,
        price: amount,
        quantity: 1,
        metadata: {
          donationType,
          message,
          isCustomAmount: true
        }
      });
    } catch (error) {
      console.error('Error adding donation to cart:', error);
      throw error;
    }
  }

  // Get available payment items for a user
  static async getAvailableItems(userId: string): Promise<any[]> {
    try {
      const items = [];

      // Get user's children (for parents) or self (for students)
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          children: {
            select: { id: true, name: true, nis: true }
          }
        }
      });

      if (!user) return items;

      // Add SPP items
      const students = user.role === 'WALI' ? user.children : [user];
      for (const student of students) {
        const sppAmount = await this.getSPPAmount(student.id);
        const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        
        items.push({
          type: CartItemType.SPP,
          id: student.id,
          name: `SPP ${student.name} - ${currentMonth}`,
          description: `Pembayaran SPP bulanan`,
          price: sppAmount,
          category: 'SPP',
          metadata: {
            studentId: student.id,
            studentName: student.name,
            period: currentMonth
          }
        });
      }

      // Add donation options
      const donationOptions = [
        { type: 'general', name: 'Donasi Umum', description: 'Donasi untuk kebutuhan umum TPQ' },
        { type: 'building', name: 'Donasi Pembangunan', description: 'Donasi untuk pembangunan fasilitas' },
        { type: 'scholarship', name: 'Donasi Beasiswa', description: 'Donasi untuk beasiswa santri' },
        { type: 'equipment', name: 'Donasi Peralatan', description: 'Donasi untuk peralatan belajar' },
        { type: 'books', name: 'Donasi Buku', description: 'Donasi untuk perpustakaan' }
      ];

      for (const donation of donationOptions) {
        items.push({
          type: CartItemType.DONATION,
          id: donation.type,
          name: donation.name,
          description: donation.description,
          price: 0, // Custom amount
          category: 'Donasi',
          isCustomAmount: true,
          metadata: {
            donationType: donation.type
          }
        });
      }

      return items;
    } catch (error) {
      console.error('Error getting available items:', error);
      throw error;
    }
  }

  // Helper methods
  private static formatCartItem(item: any): CartItem {
    return {
      id: item.id,
      cartId: item.cartId,
      userId: item.userId,
      itemType: item.itemType,
      itemId: item.itemId,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      metadata: item.metadata ? JSON.parse(item.metadata) : undefined
    };
  }

  private static async getSPPAmount(studentId: string): Promise<number> {
    // This should get the actual SPP amount from settings or student record
    // For now, return a default amount
    return 150000; // Rp 150,000
  }

  private static calculateTax(subtotal: number): number {
    // Calculate tax if applicable (e.g., 0% for education)
    return 0;
  }

  private static async calculateDiscount(cartId: string, subtotal: number): Promise<number> {
    // Calculate any applicable discounts
    // This could check for promo codes, student discounts, etc.
    return 0;
  }

  // Generate cart ID for guest users
  static generateCartId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get cart ID for user (create if doesn't exist)
  static async getOrCreateUserCartId(userId: string): Promise<string> {
    // For simplicity, we'll use userId as cartId for logged-in users
    // In a more complex system, you might want separate cart sessions
    return `user_cart_${userId}`;
  }
}
