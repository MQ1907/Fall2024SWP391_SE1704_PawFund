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
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  sentToShelter: string[];
}

const initialState: PetState = {
  pets: [],
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
      .addCase(updatePetDelivery.fulfilled, (state, action) => {
        const { petId, deliveryStatus } = action.payload;
        const pet = state.pets.find((pet) => pet._id === petId);
        if (pet) {
          pet.deliveryStatus = deliveryStatus;
        }
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
