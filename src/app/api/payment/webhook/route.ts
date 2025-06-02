import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature, PAYMENT_STATUS } from '@/lib/midtrans';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      fraud_status
    } = body;

    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(
      order_id,
      status_code,
      gross_amount,
      process.env.MIDTRANS_SERVER_KEY!,
      signature_key
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Determine payment status
    let paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED' | 'OVERDUE' = 'PENDING';
    
    if (transaction_status === PAYMENT_STATUS.SUCCESS) {
      paymentStatus = 'PAID';
    } else if (
      transaction_status === PAYMENT_STATUS.FAILED ||
      transaction_status === PAYMENT_STATUS.CANCELLED ||
      transaction_status === PAYMENT_STATUS.EXPIRED
    ) {
      paymentStatus = 'CANCELLED';
    }

    // Check if it's SPP payment or donation
    const orderType = order_id.split('_')[0];

    if (orderType === 'spp') {
      // Update SPP payment
      const payment = await prisma.payment.findFirst({
        where: { reference: order_id }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: paymentStatus,
            method: getPaymentMethod(payment_type),
            paidDate: paymentStatus === 'PAID' ? new Date() : null
          }
        });

        // Create notification for wali
        if (paymentStatus === 'PAID') {
          const santri = await prisma.santri.findUnique({
            where: { id: payment.santriId },
            include: { wali: true }
          });

          if (santri) {
            await prisma.notification.create({
              data: {
                title: 'Pembayaran Berhasil',
                message: `Pembayaran ${payment.type} untuk ${santri.name} telah berhasil diproses.`,
                type: 'SUCCESS',
                userId: santri.waliId
              }
            });
          }
        }
      }

    } else if (orderType === 'donation') {
      // Update donation
      const donation = await prisma.donation.findFirst({
        where: { reference: order_id }
      });

      if (donation) {
        await prisma.donation.update({
          where: { id: donation.id },
          data: {
            status: paymentStatus,
            method: getPaymentMethod(payment_type)
          }
        });

        // Create notification for admin
        if (paymentStatus === 'PAID') {
          const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' }
          });

          for (const admin of admins) {
            await prisma.notification.create({
              data: {
                title: 'Donasi Baru Diterima',
                message: `Donasi sebesar Rp ${donation.amount.toLocaleString()} dari ${donation.donorName} telah diterima.`,
                type: 'SUCCESS',
                userId: admin.id
              }
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getPaymentMethod(paymentType: string): 'CASH' | 'BANK_TRANSFER' | 'QRIS' | 'E_WALLET' | 'CREDIT_CARD' {
  switch (paymentType) {
    case 'credit_card':
      return 'CREDIT_CARD';
    case 'bank_transfer':
    case 'echannel':
    case 'permata':
    case 'bca_va':
    case 'bni_va':
    case 'bri_va':
      return 'BANK_TRANSFER';
    case 'gopay':
    case 'shopeepay':
    case 'dana':
    case 'ovo':
      return 'E_WALLET';
    case 'qris':
      return 'QRIS';
    default:
      return 'BANK_TRANSFER';
  }
}
