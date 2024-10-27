import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


// Định nghĩa kiểu dữ liệu cho user
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Cập nhật AuthState để bao gồm user
interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  status: 'idle',
  error: null,
};

// Cập nhật signin thunk để trả về cả token và thông tin user
export const signin = createAsyncThunk('auth/login', async (credentials: { email: string, password: string }, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:8000/auth/login', credentials);
    console.log(response.data);
    return response.data; // Giả sử response.data chứa cả token và thông tin user
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
      state.user = null;
      state.status = 'idle';
      localStorage.removeItem('token');
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
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
        state.user = action.payload.user; // Lưu thông tin user
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
        state.user = action.payload.user; // Lưu thông tin user
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

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;
