import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


import { PaymentState, PaymentLink, PaymentResponse } from '@/lib/types/payment.types';
import { createPaymentLink } from '@/services/paymentService';

const initialState: PaymentState = {
  loading: false,
  error: null,
  paymentData: null
};

export const createPayment = createAsyncThunk<PaymentResponse, PaymentLink>(
  'payment/create',
  async (paymentData: PaymentLink, { rejectWithValue }) => {
    try {
      const response = await createPaymentLink(paymentData);
      if (response.error === 0) {
        return response; // Changed from response.data to response
      }
      return rejectWithValue('Có lỗi xảy ra');
    } catch (error) {
      return rejectWithValue('Không thể kết nối đến server');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.loading = false;
      state.error = null;
      state.paymentData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload;
        state.error = null;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Có lỗi xảy ra';
        state.paymentData = null;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
