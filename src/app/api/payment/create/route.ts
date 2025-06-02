import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSPPPayment, createDonationPayment } from '@/lib/midtrans';
import { PaymentType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, santriId, amount, paymentType, donationData } = body;

    // Generate unique order ID
    const orderId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (type === 'spp') {
      // Handle SPP Payment
      if (!santriId || !amount || !paymentType) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields for SPP payment' },
          { status: 400 }
        );
      }

      // Get santri data
      const santri = await prisma.santri.findUnique({
        where: { id: santriId },
        include: { wali: true }
      });

      if (!santri) {
        return NextResponse.json(
          { success: false, error: 'Santri not found' },
          { status: 404 }
        );
      }

      // Create payment record in database
      const payment = await prisma.payment.create({
        data: {
          type: paymentType as PaymentType,
          amount: amount,
          dueDate: new Date(),
          santriId: santriId,
          reference: orderId
        }
      });

      // Create Midtrans payment
      const paymentRequest = {
        orderId: orderId,
        amount: amount,
        customerDetails: {
          firstName: santri.wali.name,
          email: santri.wali.email!,
          phone: santri.wali.phone || '08123456789'
        },
        itemDetails: [
          {
            id: payment.id,
            price: amount,
            quantity: 1,
            name: `${paymentType} - ${santri.name}`
          }
        ]
      };

      const midtransResponse = await createSPPPayment(paymentRequest);

      if (!midtransResponse.success) {
        // Delete payment record if Midtrans fails
        await prisma.payment.delete({ where: { id: payment.id } });
        
        return NextResponse.json(
          { success: false, error: midtransResponse.error },
          { status: 500 }
        );
      }

      // Update payment with Midtrans token
      await prisma.payment.update({
        where: { id: payment.id },
        data: { midtransToken: midtransResponse.token }
      });

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        token: midtransResponse.token,
        redirectUrl: midtransResponse.redirectUrl
      });

    } else if (type === 'donation') {
      // Handle Donation Payment
      if (!donationData || !amount) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields for donation' },
          { status: 400 }
        );
      }

      // Create donation record in database
      const donation = await prisma.donation.create({
        data: {
          donorName: donationData.donorName,
          donorEmail: donationData.donorEmail,
          donorPhone: donationData.donorPhone,
          amount: amount,
          type: donationData.type,
          method: 'E_WALLET', // Default, will be updated based on actual payment
          message: donationData.message,
          isAnonymous: donationData.isAnonymous || false,
          reference: orderId
        }
      });

      // Create Midtrans payment
      const paymentRequest = {
        orderId: orderId,
        amount: amount,
        customerDetails: {
          firstName: donationData.donorName,
          email: donationData.donorEmail || 'donor@rumahtahfidz.com',
          phone: donationData.donorPhone || '08123456789'
        },
        itemDetails: [
          {
            id: donation.id,
            price: amount,
            quantity: 1,
            name: `Donasi ${donationData.type} - ${donationData.donorName}`
          }
        ]
      };

      const midtransResponse = await createDonationPayment(paymentRequest);

      if (!midtransResponse.success) {
        // Delete donation record if Midtrans fails
        await prisma.donation.delete({ where: { id: donation.id } });
        
        return NextResponse.json(
          { success: false, error: midtransResponse.error },
          { status: 500 }
        );
      }

      // Update donation with Midtrans token
      await prisma.donation.update({
        where: { id: donation.id },
        data: { midtransToken: midtransResponse.token }
      });

      return NextResponse.json({
        success: true,
        donationId: donation.id,
        token: midtransResponse.token,
        redirectUrl: midtransResponse.redirectUrl
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid payment type' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
