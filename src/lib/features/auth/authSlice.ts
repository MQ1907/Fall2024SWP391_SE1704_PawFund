import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const signin = createAsyncThunk('auth/login', async (credentials: { email: string, password: string }) => {
  try {
    const response = await axios.post('http://localhost:8000/auth/login', credentials);
    console.log(response.data);
    return response.data; 
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed"); 
    }
    throw error;
  }
});

export const signup = createAsyncThunk('auth/signup', async (userData: { name: string, password: string, email: string, role: string }, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8000/auth/sign-up', userData);
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
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null, 
  status: 'idle',
  error: null,
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
        state.error = action.error.message || 'Signin failed';
        console.error('Signin failed:', action.error.message); 
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token; 
        console.log('Signup successful:', action.payload); // Log the signup response
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token); 
        }
      })
      
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Signup failed';
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;