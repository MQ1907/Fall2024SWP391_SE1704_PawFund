import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create PayOS payment link
export const createPayOSLink = createAsyncThunk(
  'payment/createPayOSLink',
  async (paymentData: { amount: number; description: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/payment/create-payos-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?userId=${paymentData.userId}&amount=${paymentData.amount}&description=${encodeURIComponent(paymentData.description)}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel`
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create payment link');
      }
      
      // Redirect to PayOS checkout page
      if (data.data?.checkoutUrl) {
        window.open(data.data.checkoutUrl, '_self');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user transaction history
export const fetchUserTransactionHistory = createAsyncThunk(
  'payment/fetchHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/payment/history/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch transaction history');
      }
      
      return data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: PaymentState = {
  transactions: [],
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.transactions = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createPayOSLink
      .addCase(createPayOSLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayOSLink.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createPayOSLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle fetchUserTransactionHistory
      .addCase(fetchUserTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchUserTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
