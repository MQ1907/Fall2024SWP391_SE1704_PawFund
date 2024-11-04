import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk for creating a health check
export const createHealthCheck = createAsyncThunk(
  "healthCheck/create",
  async (healthCheckData: {
    petId: string;
    healthStatus: string;
    healthStatusDescription?: string;
    note?: string;
    weight?: number;
    temperature?: number;
    checkingDate: Date;
    checkingBy: string;
    checkingType?: string;
    isOld?: boolean;
  }) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/health-check/create/${healthCheckData.petId}`,
        healthCheckData
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to create health check"
        );
      }
      throw error;
    }
  }
);
export const fetchHealthCheckByPetID = createAsyncThunk(
  "healthCheck/fetchByPetID",
  async (petId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/health-check/pet/${petId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch health checks"
        );
      }
      throw error;
    }
  }
);

export const fetchHealthCheckByShelterStaff = createAsyncThunk(
  "healthCheck/fetchHealthCheckByShelterStaff",
  async (petId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/health-check/checkingBy/${petId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch health checks"
        );
      }
      throw new Error("Network error: Failed to fetch health checks");
    }
  }
);

interface HealthCheckState {
  healthChecks: any[]; // List of health checks
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: HealthCheckState = {
  healthChecks: [],
  status: "idle",
  error: null,
};

const healthCheckSlice = createSlice({
  name: "healthChecks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHealthCheck.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createHealthCheck.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.healthChecks.push(action.payload); // Add the new health check to the healthChecks array
      })
      .addCase(createHealthCheck.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create health check";
      })
      .addCase(fetchHealthCheckByPetID.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHealthCheckByPetID.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.healthChecks = action.payload; // Replace the healthChecks array with the fetched data
      })
      .addCase(fetchHealthCheckByPetID.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch health checks";
      })
         .addCase(fetchHealthCheckByShelterStaff.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHealthCheckByShelterStaff.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.healthChecks = action.payload;
      })
      .addCase(fetchHealthCheckByShelterStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch health checks";
      });
  },
});

// Export the actions (if needed)
export const { clearError } = healthCheckSlice.actions;

// Export the reducer
export default healthCheckSlice.reducer;
