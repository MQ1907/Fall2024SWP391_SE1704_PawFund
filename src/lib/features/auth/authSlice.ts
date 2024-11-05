import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signin = createAsyncThunk('auth/login', async (credentials: { email: string, password: string }, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8000/auth/login', credentials);
    console.log(response.data);
    return response.data; 
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data.message || "Login failed");
    }
    throw error;
  }
});

export const signup = createAsyncThunk('auth/signup', async (userData: { name: string, password: string, email: string, role: string, avatar?: string, address?: string, phone?: string }, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8000/auth/signup', userData);
    console.log('Signup response:', response.data); 
    return response.data;
  } catch (error: any) {
    console.error('Signup error:', error.response?.data || error.message);
    if (error.response) {
      return rejectWithValue(error.response.data.message || 'Signup failed');
    }
    throw error;
  }
});

interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null, 
  status: 'idle',
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.status = 'idle';
      localStorage.removeItem('token'); 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token; 
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token); 
        }
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Signin failed';
        console.error('Signin failed:', action.payload); 
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token; 
        state.message = action.payload.message; 
        console.log('Signup successful:', action.payload); // Log the signup response
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token); 
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Signup failed';
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;