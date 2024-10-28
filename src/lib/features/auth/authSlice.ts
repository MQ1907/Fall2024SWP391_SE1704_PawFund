import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  // thêm các trường khác nếu cần
}

interface AuthState {
  token: string | null;
  currentUser: User | null;  // thêm currentUser
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  currentUser: null,  // thêm vào initial state
  status: 'idle',
  error: null,
};

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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.currentUser = null;  // clear user khi logout
      state.status = 'idle';
      localStorage.removeItem('token');
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
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
        state.currentUser = action.payload.user;  // lưu thông tin user
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
        state.currentUser = action.payload.user;  // lưu thông tin user
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

export const { logout, setCurrentUser } = authSlice.actions;

// Thêm selector để dễ dàng lấy currentUser
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.currentUser;

export default authSlice.reducer;
