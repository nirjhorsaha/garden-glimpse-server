import axios from 'axios';
import dotenv from 'dotenv';
import { PaymentData } from './payment.interface';

dotenv.config();

export const initiatePayment = async (paymentData: PaymentData) => {
  try {
    const response = await axios.post(process.env.PAYMENT_URL!, {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNATURE_KEY,
      tran_id: paymentData.transactionID,
      success_url: `https://nexus-reserve-server.vercel.app/api/payment/confirmation?transactionID=${paymentData.transactionID}&status=success`,
      fail_url: `https://nexus-reserve-server.vercel.app/api/payment/confirmation?&status=failed`,
      cancel_url: 'http://localhost:5173',
      amount: paymentData.totalAmount,
      currency: 'BDT',
      desc: 'Merchant Registration Payment',
      cus_name: paymentData.customerName,
      cus_email: paymentData.customerEmail,
      cus_add1: paymentData.customerAddress,
      cus_add2: 'N/A',
      cus_city: 'Dhaka',
      cus_state: 'N/A',
      cus_postcode: '1206',
      cus_country: 'Bangladesh',
      cus_phone: paymentData.customerPhone,
      type: 'json',
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to initiate payment. Please try again.');
  }
};

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
      params: {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNATURE_KEY,
        type: 'json',
        request_id: tnxId,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Payment validation failed!');
  }
};
