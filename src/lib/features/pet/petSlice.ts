import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk for creating a pet
export const createPet = createAsyncThunk(
  "pet/create",
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
    gender:string;
    rescueDate:Date;
  }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/pet/create",
        petData
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to create pet");
      }
      throw error;
    }
  }
);

export const fetchPets = createAsyncThunk("pet/fetchAll", async () => {
  try {
    const response = await axios.get("http://localhost:8000/pet/find-all");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch pets");
    }
    throw error;
  }
});

export const fetchPetsByStatus = createAsyncThunk(
  "pet/fetchByStatus",
  async (deliveryStatus: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/pet/find-all?deliveryStatus=${deliveryStatus}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to fetch pets");
      }
      throw error;
    }
  }
);

// New async thunk for fetching a single pet by ID
export const fetchPetById = createAsyncThunk(
  "pet/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('Fetching pet with ID:', id);
      // Update the URL to use _id
      const response = await axios.get(`http://localhost:8000/pet/find-by-id/${id}`);
      console.log('API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch pet");
    }
  }
);

// Action để xóa pet
export const deletePet = createAsyncThunk(
  "pets/deletePet",
  async (petId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/pet/delete/${petId}`
      );
      return response.data; // Trả về kết quả từ server nếu thành công
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Something went wrong while deleting pet"
      );
    }
  }
);

const loadSentToShelter = () => {
  try {
    const serializedState = localStorage.getItem("sentToShelter");
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch {
    return [];
  }
};
const saveSentToShelter = (state: string[]) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("sentToShelter", serializedState);
  } catch {
    // Ignore write errors
  }
};
export const updatePetDelivery = createAsyncThunk(
  'pets/updatePetStatus',
  async ({ petId, deliveryStatus }: { petId: string; deliveryStatus: string }) => {
    await axios.put(`http://localhost:8000/pet/update-delivery-status/${petId}`, {
      deliveryStatus,
    });
    return { petId, deliveryStatus };
  }
);
interface PetState {
  pets: any[]; 
  currentPet: any | null; // Add this line
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  sentToShelter: string[];
}

const initialState: PetState = {
  pets: [],
  currentPet: null, // Add this line
  status: "idle",
  error: null,
  sentToShelter: loadSentToShelter(),
};

const petSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPets(state, action) {
      state.pets = action.payload;
    },
    removePet(state, action) {
      state.sentToShelter.push(action.payload);
      saveSentToShelter(state.sentToShelter);
    },
    updatePetStatus: (state, action) => {
      const { petId, deliveryStatus } = action.payload;
      const pet = state.pets.find((pet) => pet._id === petId);
      if (pet) {
        pet.deliveryStatus = deliveryStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
    //Create Pet
      .addCase(createPet.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pets.push(action.payload);
      })
      .addCase(createPet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to create pet";
      })

      //Fetch All Pet
      .addCase(fetchPets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pets = action.payload; 
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch pets";
      })
      
      //Fetch Pet By Status
        .addCase(fetchPetsByStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPetsByStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pets = action.payload;
      })
      .addCase(fetchPetsByStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch pets by status";
      })
      .addCase(updatePetDelivery.fulfilled, (state, action) => {
        const { petId, deliveryStatus } = action.payload;
        const pet = state.pets.find((pet) => pet._id === petId);
        if (pet) {
          pet.deliveryStatus = deliveryStatus;
        }
      })
      .addCase(fetchPetById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPetById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentPet = action.payload;
      })
      .addCase(fetchPetById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string || "Failed to fetch pet";
      })
      //delete pet
      .addCase(deletePet.pending, (state) => {
        state.status = "loading"; 
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pets = state.pets.filter((pet) => pet._id !== action.meta.arg); 
      })
      .addCase(deletePet.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to delete pet"; 
      });
  },
});
import { RootState } from "../../store";

export const selectPendingPets = (state: RootState) =>
  state.pets.pets.filter((pet) => pet.deliveryStatus === "PENDING");
export const selectCompletedPets = (state: RootState) =>
  state.pets.pets.filter((pet) => pet.deliveryStatus === 'COMPLETED');
export const { clearError, setPets, removePet,updatePetStatus } = petSlice.actions;

// Export the reducer
export default petSlice.reducer;
