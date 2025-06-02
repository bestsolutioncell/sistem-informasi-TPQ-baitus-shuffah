import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/lib/cart-service';

// POST /api/cart/donation - Add donation to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, donationType, amount, message, userId } = body;

    // Validation
    if (!cartId || !donationType || !amount) {
      return NextResponse.json(
        { success: false, message: 'Cart ID, donation type, and amount are required' },
        { status: 400 }
      );
    }

    if (amount < 10000) {
      return NextResponse.json(
        { success: false, message: 'Minimum donation amount is Rp 10,000' },
        { status: 400 }
      );
    }

    const cartItem = await CartService.addDonationToCart(
      cartId,
      donationType,
      amount,
      message,
      userId
    );

    return NextResponse.json({
      success: true,
      message: 'Donation added to cart successfully',
      data: cartItem
    });
  } catch (error) {
    console.error('Error adding donation to cart:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to add donation to cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/cart/donation - Get donation types
export async function GET(request: NextRequest) {
  try {
    const donationTypes = [
      {
        id: 'general',
        name: 'Donasi Umum',
        description: 'Donasi untuk kebutuhan operasional sehari-hari TPQ',
        icon: '🏫',
        suggestedAmounts: [25000, 50000, 100000, 250000, 500000],
        minAmount: 10000
      },
      {
        id: 'building',
        name: 'Donasi Pembangunan',
        description: 'Donasi untuk pembangunan dan renovasi fasilitas TPQ',
        icon: '🏗️',
        suggestedAmounts: [100000, 250000, 500000, 1000000, 2500000],
        minAmount: 50000
      },
      {
        id: 'scholarship',
        name: 'Donasi Beasiswa',
        description: 'Donasi untuk membantu santri kurang mampu',
        icon: '🎓',
        suggestedAmounts: [150000, 300000, 600000, 1200000, 2400000],
        minAmount: 150000
      },
      {
        id: 'equipment',
        name: 'Donasi Peralatan',
        description: 'Donasi untuk peralatan belajar dan mengajar',
        icon: '📚',
        suggestedAmounts: [50000, 100000, 250000, 500000, 1000000],
        minAmount: 25000
      },
      {
        id: 'books',
        name: 'Donasi Buku',
        description: 'Donasi untuk pengembangan perpustakaan TPQ',
        icon: '📖',
        suggestedAmounts: [25000, 50000, 100000, 200000, 500000],
        minAmount: 25000
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        donationTypes,
        totalTypes: donationTypes.length
      }
    });
  } catch (error) {
    console.error('Error getting donation types:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get donation types',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
