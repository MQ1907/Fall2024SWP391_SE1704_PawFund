import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk for creating a pet
export const createPet = createAsyncThunk(
  "pet/create",
  async (
    petData: {
      shelterLocation: string;
      name: string;
      description: string;
      image: string;
      color: string;
      breed: string;
      note: string;
      rescueBy: string;
      rescueFee: number;
      locationFound: string;
      gender: string;
      rescueDate: Date;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/pet/create",
        petData
      );
      return response.data;
    } catch (error: any) {
      console.error("Server error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create pet"
      );
    }
  }
);



// Tạo async thunk cho việc cập nhật
export const changeVaccinated = createAsyncThunk(
  'pets/changeVaccinated',
  async ({ petId, isVaccinated }: UpdateVaccinatedPayload) => {
    const response = await axios.patch(`http://localhost:8000/pet/update-pet-vacinted/${petId}`, {
      isVaccinated,
    });
    return response.data; // Trả về dữ liệu nhận được từ server
  }
);

export const fetchPets = createAsyncThunk("pet/fetchAll", async () => {
  try {
    const response = await axios.get("http://localhost:8000/pet/find-all");
    return response.data.map((pet: any) => ({
      _id: pet._id,
      // shelterLocation: pet.shelterId,
      name: pet.name,
      image: pet.image,
      breed: pet.breed,
      color: pet.color,
      gender: pet.gender,
      rescueDate: pet.rescueDate,
      description: pet.description,
      isVacinted: pet.isVacinted,
      isAdopted: pet.isAdopted,
      deliveryStatus: pet.deliveryStatus, // Changed from petStatus to deliveryStatus
      rescueBy: pet.rescueBy,
    }));
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch pets");
    }
    throw error;
  }
});

export const updatePet = createAsyncThunk(
  "pet/update",
  async (
    {
      petId,
      petData,
    }: {
      petId: string;
      petData: {
        image: string;
        name: string;
        description?: string;
        color?: string;
        breed: string;
        gender: string;
        note?: string;
        isVaccinated?: boolean;
        isVerified?: boolean;
        isAdopted?: boolean;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/pet/update/${petId}`,
        petData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update pet"
      );
    }
  }
);

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

export const fetchCreateByVolunteerId = createAsyncThunk(
  "create/fetchByVolunteerId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const url = `http://localhost:8000/pet/view-by-volunteer/${userId}`;
      console.log("Fetching adoption requests from URL:", url); // Debugging log
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error("Error response:", error.response); // Debugging log
        return rejectWithValue(
          error.response.data.message ||
            "Failed to fetch adoption requests for this volunteer"
        );
      }
      console.error("Error:", error);
      return rejectWithValue("Failed to fetch adoption requests for this volunteer");
    }
  }
);




// Update the fetchPetById thunk
export const fetchPetById = createAsyncThunk(
  "pet/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/pet/find-by-id/${id}`
      );
      const {
        name,
        image,
        breed,
        description,
        isVacinted,
        color,
        gender,
        locationFound,
        isAdopted,
        rescueDate
      } = response.data;
      return {
        name,
        image,
        breed,
        description,
        isVacinted,
        color,
        gender,
        locationFound,
        isAdopted,
        rescueDate
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pet"
      );
    }
  }
);

// Action để xóa pet
export const deletePet = createAsyncThunk(
  "pets/deletePet",
  async (petId: string, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/pet/delete/${petId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete pet"
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
  "pets/updatePetStatus",
  async ({
    petId,
    deliveryStatus,
  }: {
    petId: string;
    deliveryStatus: string;
  }) => {
    await axios.put(
      `http://localhost:8000/pet/update-delivery-status/${petId}`,
      {
        deliveryStatus,
      }
    );
    return { petId, deliveryStatus };
  }
);

export const updateAdoptedStatus = createAsyncThunk(
  "pets/updateAdoptedStatus",
  async (
    {
      petId,
      isAdopted,
    }: {
      petId: string;
      isAdopted: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/pet/update-pet-adopted/${petId}`,
        {
          isAdopted,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update pet adopted status"
      );
    }
  }
);

export const fetchPetsByBreed = createAsyncThunk(
  "pet/fetchByBreed",
  async (breed: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/pet/find-by-breed/${breed}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pets by breed"
      );
    }
  }
);

interface UpdateVaccinatedPayload {
  petId: string;
  isVaccinated: boolean;
}

interface Pet {
 _id: string;
  name: string;
  image: string;
  breed: string;
  color: string;
  gender: string;
  rescueDate: Date;
  description: string;
  isVaccinated: boolean;
  isAdopted: boolean;
  deliveryStatus: string;
  rescueBy: string;
}

interface PetState {
  historyPet:any[],
  pets: Pet[];
  filteredPets: Pet[];
  currentPet: Pet | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  sentToShelter: string[];
}

const initialState: PetState = {
  historyPet:[],
  pets: [],
  filteredPets: [],
  currentPet: null,
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
    searchPets: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      if (searchTerm === "") {
        state.filteredPets = state.pets;
      } else {
        state.filteredPets = state.pets.filter((pet) =>
          pet.name.toLowerCase().includes(searchTerm)
        );
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
        state.filteredPets = action.payload; // Initialize filteredPets with all pets
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
        state.error = (action.payload as string) || "Failed to fetch pet";
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
      })
      // Add this case for updatePetDeliveryStatus
      .addCase(updatePetDeliveryStatus.fulfilled, (state, action) => {
        const updatedPet = action.payload;
        const index = state.pets.findIndex((pet) => pet._id === updatedPet._id);
        if (index !== -1) {
          state.pets[index] = updatedPet;
          state.filteredPets = state.pets; // Update filteredPets as well
        }
      })
      //update pet
      .addCase(updatePet.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.pets.findIndex(
          (pet) => pet._id === action.payload._id
        );
        if (index !== -1) {
          state.pets[index] = action.payload;
        }
      })
      .addCase(updatePet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateAdoptedStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAdoptedStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedPet = action.payload;
        const index = state.pets.findIndex((pet) => pet._id === updatedPet._id);
        if (index !== -1) {
          state.pets[index] = updatedPet;
          state.filteredPets = state.pets; // Update filteredPets as well
        }
      })
      .addCase(updateAdoptedStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      //History Volunteer
       .addCase(fetchCreateByVolunteerId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCreateByVolunteerId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.historyPet = action.payload; // Cập nhật danh sách yêu cầu
      })
      .addCase(fetchCreateByVolunteerId.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch adoption requests";
      })
      //change vacinated
      .addCase(changeVaccinated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeVaccinated.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật trạng thái isVaccinated cho pet trong state
        const updatedPet = action.payload;
        const index = state.pets.findIndex(pet => pet.id === updatedPet.id);
        if (index !== -1) {
          state.pets[index] = updatedPet;
        }
      })
      .addCase(changeVaccinated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //find pet by breed
      .addCase(fetchPetsByBreed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPetsByBreed.fulfilled, (state, action: PayloadAction<Pet[]>) => {
        state.status = "succeeded";
        state.filteredPets = action.payload; // Store the pets found by breed
      })
      .addCase(fetchPetsByBreed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

import { RootState } from "../../store";

export const selectPendingPets = (state: RootState) =>
  state.pets.pets.filter((pet) => pet.deliveryStatus === "PENDING");
export const selectCompletedPets = createSelector(
  (state: RootState) => state.pets.pets,
  (pets) => pets.filter((pet) => pet.deliveryStatus === "COMPLETED")
);

export const { clearError, setPets, removePet, searchPets } = petSlice.actions;

// Export the reducer
export default petSlice.reducer;

// New thunk for updating pet status
export const updatePetStatus = createAsyncThunk(
  "pets/updatePetStatus",
  async (
    { petId, petStatus }: { petId: string; petStatus: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/pet/update/${petId}`,
        {
          petStatus,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update pet status"
      );
    }
  }
);

// Replace updatePetStatus with updatePetDeliveryStatus
export const updatePetDeliveryStatus = createAsyncThunk(
  "pets/updatePetDeliveryStatus",
  async (
    { petId, deliveryStatus }: { petId: string; deliveryStatus: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/pet/update/${petId}`,
        {
          deliveryStatus,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update pet delivery status"
      );
    }
  }
);

