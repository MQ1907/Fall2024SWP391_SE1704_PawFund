import axios from 'axios';
import { PaymentLink, PaymentResponse } from '../types/payment.types';

const API_URL = process.env.NEXT_PUBLIC_PAYOS_API_URL || 'http://localhost:8000';

export const createPaymentLink = async (paymentData: PaymentLink): Promise<PaymentResponse> => {
  try {
    console.log('Sending request to:', `${API_URL}/payment`);
    console.log('With data:', paymentData);
    
    const response = await axios.post(`${API_URL}/payment`, paymentData);
    console.log('API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Payment service error:', error);
    throw error;
  }
};