import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for creating a pet
export const createPet = createAsyncThunk(
  'pet/create',
  async (petData: {
    shelterId: string;
    petCode: string;
    name: string;
    description: string;
    image: string;
    color: string;
    breed: string; 
    age: number;
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

export const fetchPets = createAsyncThunk(
  'pet/fetchAll',
  async () => {
    try {
      const response = await axios.get('http://localhost:8000/pet/find-all');
      return response.data; // Trả về dữ liệu mà bạn nhận được
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch pets');
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
        state.pets.push(action.payload); 
      })
      .addCase(createPet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to create pet';
      })
       .addCase(fetchPets.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(fetchPets.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.pets = action.payload; // Cập nhật danh sách thú cưng
    })
    .addCase(fetchPets.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Failed to fetch pets';
    });
  }
});

// //Featch
// export const fetchPets = createAsyncThunk(
//   'pet/fetchAll',
//   async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/pet/find-all');
   
//       return response.data.map((pet: { name: string; image: string }) => ({
//         name: pet.name,
//         image: pet.image,
//       }));
//     } catch (error: any) {
//       if (error.response) {
//         throw new Error(error.response.data.message || 'Failed to fetch pets');
//       }
//       throw error;
//     }
//   }
// );


// Export the actions (if needed)
export const { clearError } = petSlice.actions;

// Export the reducer
export default petSlice.reducer;
