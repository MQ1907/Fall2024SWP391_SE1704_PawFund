// src/store/adoptionSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk for creating an adoption request
export const createAdoptionRequest = createAsyncThunk(
  "adoption/create",
  async (adoptionData: {
    petId: string;  
    userId: string; 
    requestDate: Date;
    reviewBy: string; 
    comment: string;
    adoptionDate: Date;
    status: string;
  }) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/adoption-requests/create`, 
        adoptionData
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to create adoption request"
        );
      }
      throw error;
    }
  }
);

interface AdoptionState {
  adoptionRequests: any[]; // List of adoption requests
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdoptionState = {
  adoptionRequests: [],
  status: "idle",
  error: null,
};

const adoptionSlice = createSlice({
  name: "adoption",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAdoptionRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAdoptionRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.adoptionRequests.push(action.payload); // Add the new adoption request to the array
      })
      .addCase(createAdoptionRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Failed to create adoption request";
      });
  },
});

// Export the actions (if needed)
export const { clearError } = adoptionSlice.actions;

// Export the reducer
export default adoptionSlice.reducer;
