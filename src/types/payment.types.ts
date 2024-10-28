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
// Có thể thêm các interface phụ trợ nếu cần
export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}

// Enum cho các trạng thái thanh toán
export enum PaymentStatusEnum {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Interface cho state của payment trong Redux
export interface PaymentState {
  loading: boolean;
  error: string | null;
  paymentData: any; // or define a more specific type for your payment data
}
