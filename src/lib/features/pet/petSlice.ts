import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for creating a pet
export const createPet = createAsyncThunk(
  'pet/create',
  async (petData: {
    id:number;
    shelterId: string;
    petCode: string;
    name: string;
    description: string;
    image: string;
    color: string;
    breed: string;
    age: number;
    species: string;
    isVacinted: boolean;
    isVerified: boolean;
    deliveryStatus: string;
    isAdopted: boolean;
    note: string;
    rescueBy: string;
    rescueFee: number;
    locationFound: string;
    petStatus: string;
  }) => {
    try {
      const response = await axios.post('http://localhost:8000/pet/create', petData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to create pet');
      }
      throw error;
    }
  }
);

interface PetState {
  pets: any[];  // List of pets
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PetState = {
  pets: [],
  status: 'idle',
  error: null,
};

const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add other reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pets.push(action.payload); // Add the new pet to the pets array
      })
      .addCase(createPet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create pet';
      });
  }
});

// Export the actions (if needed)
export const { clearError } = petSlice.actions;

// Export the reducer
export default petSlice.reducer;
