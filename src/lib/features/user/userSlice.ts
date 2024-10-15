import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserData as fetchUserDataAPI, fetchUserList as fetchUserListAPI, deleteUser as deleteUserAPI } from './userAPI';

export const fetchUserData = createAsyncThunk('user/fetchUserData', async (userId: string, { rejectWithValue }) => {
  try {
    const data = await fetchUserDataAPI(userId);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchUserList = createAsyncThunk('user/fetchUserList', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchUserListAPI();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await deleteUserAPI(userId);
      return userId;
    } catch (error: any) {
      console.error('deleteUser thunk error:', error);
      return rejectWithValue(error.message);
    }
  }
);

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

interface UserState {
  user: User | null;
  userList: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  userList: [],
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchUserList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userList = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userList = state.userList.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
