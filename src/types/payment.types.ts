export interface PaymentLink {
    amount: number;
    currency: string;
    orderId: string;
    returnUrl: string;
    cancelUrl: string;
 
  }
  export interface PaymentResponse {
    error: number;
    message: string;
    data: {
      checkoutUrl: string;
      orderId: string;
      amount: number;
      currency: string;
    } | null;
  }

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}


export enum PaymentStatusEnum {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}


export interface PaymentState {
  loading: boolean;
  error: string | null;
  paymentData: any; 
}
