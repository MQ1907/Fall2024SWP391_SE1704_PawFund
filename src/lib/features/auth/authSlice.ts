import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks cho Signin và Signup
export const signin = createAsyncThunk('auth/login', async (credentials: { email: string, password: string }) => {
 try {
    const response = await axios.post('http://localhost:8000/auth/login', credentials);
    return response.data;
 } catch (error: any ) {
    if(error.response){
        throw new Error(error.response.data.message || "Login failed");
    }
    throw error;
 }
 
});

export const signup = createAsyncThunk('auth/signup', async (userData: { name: string, password: string, email: string ,role: string[] }) => {
  const response = await axios.post('http://localhost:8000/auth/signup', userData);
  return response.data;
});

interface AuthState {

  user:  null;//-
 

  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Signin failed';
        console.error('Signin failed:', action.error.message); // Log lỗi
      })




      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Signup failed';
      });
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
