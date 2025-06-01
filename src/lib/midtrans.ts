import midtransClient from 'midtrans-client';

// Initialize Snap API
export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!
});

// Initialize Core API
export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!
});

// Payment types
export interface PaymentRequest {
  orderId: string;
  amount: number;
  customerDetails: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
  };
  itemDetails: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
  customExpiry?: {
    expiry_duration: number;
    unit: 'second' | 'minute' | 'hour' | 'day';
  };
}

// Create payment token for SPP
export async function createSPPPayment(paymentData: PaymentRequest) {
  try {
    const parameter = {
      transaction_details: {
        order_id: paymentData.orderId,
        gross_amount: paymentData.amount
      },
      customer_details: paymentData.customerDetails,
      item_details: paymentData.itemDetails,
      credit_card: {
        secure: true
      },
      custom_expiry: paymentData.customExpiry || {
        expiry_duration: 24,
        unit: 'hour'
      },
      callbacks: {
        finish: `${process.env.APP_URL}/payment/success`,
        error: `${process.env.APP_URL}/payment/error`,
        pending: `${process.env.APP_URL}/payment/pending`
      }
    };

    const transaction = await snap.createTransaction(parameter);
    return {
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url
    };
  } catch (error) {
    console.error('Midtrans SPP Payment Error:', error);
    return {
      success: false,
      error: 'Failed to create payment'
    };
  }
}

// Create payment token for Donation
export async function createDonationPayment(paymentData: PaymentRequest) {
  try {
    const parameter = {
      transaction_details: {
        order_id: paymentData.orderId,
        gross_amount: paymentData.amount
      },
      customer_details: paymentData.customerDetails,
      item_details: paymentData.itemDetails,
      credit_card: {
        secure: true
      },
      custom_expiry: paymentData.customExpiry || {
        expiry_duration: 1,
        unit: 'hour'
      },
      callbacks: {
        finish: `${process.env.APP_URL}/donation/success`,
        error: `${process.env.APP_URL}/donation/error`,
        pending: `${process.env.APP_URL}/donation/pending`
      }
    };

    const transaction = await snap.createTransaction(parameter);
    return {
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url
    };
  } catch (error) {
    console.error('Midtrans Donation Payment Error:', error);
    return {
      success: false,
      error: 'Failed to create donation payment'
    };
  }
}

// Check payment status
export async function checkPaymentStatus(orderId: string) {
  try {
    const statusResponse = await coreApi.transaction.status(orderId);
    return {
      success: true,
      data: statusResponse
    };
  } catch (error) {
    console.error('Midtrans Status Check Error:', error);
    return {
      success: false,
      error: 'Failed to check payment status'
    };
  }
}

// Cancel payment
export async function cancelPayment(orderId: string) {
  try {
    const cancelResponse = await coreApi.transaction.cancel(orderId);
    return {
      success: true,
      data: cancelResponse
    };
  } catch (error) {
    console.error('Midtrans Cancel Payment Error:', error);
    return {
      success: false,
      error: 'Failed to cancel payment'
    };
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  signatureKey: string
): boolean {
  const crypto = require('crypto');
  const hash = crypto
    .createHash('sha512')
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest('hex');
  
  return hash === signatureKey;
}

// Payment status mapping
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'settlement',
  FAILED: 'failure',
  CANCELLED: 'cancel',
  EXPIRED: 'expire'
} as const;

// Payment method mapping
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  E_WALLET: 'e_wallet',
  QRIS: 'qris',
  CONVENIENCE_STORE: 'cstore'
} as const;
