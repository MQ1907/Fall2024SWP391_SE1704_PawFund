import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface FeedbackState {
  feedback: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FeedbackState = {
  feedback: null,
  status: 'idle',
  error: null,
};

export const createFeedback = createAsyncThunk(
  'feedback/createFeedback',
  async (feedbackData: { userId: string; petId: string; description: string; rating: number }) => {
    const response = await axios.post('http://localhost:8000/feedback/create', feedbackData);
    return response.data;
  }
);
export const fetchFeedbackByUserId = createAsyncThunk(
    'feedback/fetchFeedbackByUserId',
    async (userId: string) => {
      const response = await axios.get(`http://localhost:8000/feedback/view-by-user/${userId}`);
      return response.data;
    }
  );
  export const updateFeedback = createAsyncThunk(
    'feedback/updateFeedback',
    async ({ feedbackId, feedbackData }: { feedbackId: string; feedbackData: { description: string; rating: number } }) => {
      const response = await axios.put(`http://localhost:8000/feedback/update/${feedbackId}`, feedbackData);
      return response.data;
    }
  );
  export const fetchFeedbackByPetId = createAsyncThunk(
    'feedback/fetchFeedbackByPetId',
    async (petId: string) => {
      const response = await axios.get(`http://localhost:8000/feedback/view-by-pet/${petId}`);
      return response.data;
    }
  );
  export const deleteFeedback = createAsyncThunk(
    'feedback/deleteFeedback',
    async (feedbackId: string) => {
      const response = await axios.delete(`http://localhost:8000/feedback/delete/${feedbackId}`);
      return response.data;
    }
  );
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFeedback.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feedback = action.payload;
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create feedback';
      })
      .addCase(fetchFeedbackByUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeedbackByUserId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feedback = action.payload;
      })
      .addCase(fetchFeedbackByUserId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch feedback';
      })
      .addCase(updateFeedback.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feedback = action.payload;
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update feedback';
      })
      .addCase(fetchFeedbackByPetId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeedbackByPetId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feedback = action.payload;
      })
      .addCase(fetchFeedbackByPetId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch feedback by pet ID';
      })
      .addCase(deleteFeedback.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feedback = action.payload;
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete feedback';
      });
  },
});

export default feedbackSlice.reducer;