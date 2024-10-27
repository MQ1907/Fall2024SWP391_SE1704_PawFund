import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk for creating an adoption request
export const createAdoptionRequest = createAsyncThunk(
  "adoption/create",
  async (adoptionData: {
    petId: string;
    userId: string;
    requestDate: Date; // Changed from Date to string
    comment: string;
  }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/adoption-requests/create",
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

// Async Thunk for fetching all adoption requests
export const fetchAdoptionRequests = createAsyncThunk(
  "adoption/fetchAdoptionRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/adoption-requests/find-all"
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Async Thunk for fetching adoption requests by petId
export const fetchAdoptionRequestsByPetId = createAsyncThunk(
  "adoption/fetchByPetId",
  async (petId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/adoption-requests/find-by-pet/${petId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "Failed to fetch adoption requests for this pet"
        );
      }
      return rejectWithValue("Failed to fetch adoption requests for this pet");
    }
  }
);

// Async Thunk for updating adoption request status
export const updateAdoptionRequestStatus = createAsyncThunk(
  "adoption/updateStatus",
  async (
    {
      requestId,
      status,
      comment,
      reviewBy,
    }: { requestId: string; status: string; comment: string; reviewBy: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/adoption-requests/update-status/${requestId}`,
        { status, comment, reviewBy }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "Failed to update adoption request status"
        );
      }
      return rejectWithValue("Failed to update adoption request status");
    }
  }
);

interface AdoptionState {
  adoptionRequests: any[]; // Danh sách các yêu cầu nhận nuôi
  status: "idle" | "loading" | "succeeded" | "failed"; // Trạng thái của yêu cầu
  error: string | null; // Thông báo lỗi
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
      state.error = null; // Xóa thông báo lỗi
    },
    // Thêm các reducer khác nếu cần
  },
  extraReducers: (builder) => {
    // Xử lý các yêu cầu fetch all adoption requests
    builder
      .addCase(fetchAdoptionRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdoptionRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.adoptionRequests = action.payload; // Cập nhật danh sách tất cả yêu cầu
      })
      .addCase(fetchAdoptionRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch all adoption requests";
      })
      // Xử lý các yêu cầu fetch adoption requests by petId
      .addCase(fetchAdoptionRequestsByPetId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdoptionRequestsByPetId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.adoptionRequests = action.payload; // Cập nhật danh sách yêu cầu
      })
      .addCase(fetchAdoptionRequestsByPetId.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch adoption requests";
      })
      // Xử lý yêu cầu tạo adoption request
      .addCase(createAdoptionRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAdoptionRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.adoptionRequests.push(action.payload); // Thêm yêu cầu mới vào danh sách
      })
      .addCase(createAdoptionRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to create adoption request";
      })
      // Xử lý yêu cầu cập nhật adoption request status
      .addCase(updateAdoptionRequestStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAdoptionRequestStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedRequestIndex = state.adoptionRequests.findIndex(
          (request) => request._id === action.payload._id
        );
        if (updatedRequestIndex !== -1) {
          state.adoptionRequests[updatedRequestIndex] = action.payload; // Cập nhật yêu cầu đã thay đổi
        }
      })
      .addCase(updateAdoptionRequestStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) ||
          "Failed to update adoption request status";
      });
  },
});

export const { clearError } = adoptionSlice.actions;

export default adoptionSlice.reducer;
