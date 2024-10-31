import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = 'http://localhost:8000';

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/event/view-all`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);


export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/event/view-one/${id}`
      );
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event"
      );
    }
  }
);


export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData: {
    title: string;
    description: string;
    image: string;
    start: Date;
    end: Date;
    location: string;
    supporters: string[];
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/event/create`,
        eventData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

// Thêm action updateEvent
interface Supporter {
  _id?: string;
  name?: string;
  avatar?: string;
}

interface UpdateEventDto {
  title: string;
  description: string;
  image: string;
  start: Date;
  end: Date;
  location: string;
  supporters: (string | Supporter)[];
}

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, updateEventDto }: { id: string, updateEventDto: UpdateEventDto }) => {
    try {
      // Đảm bảo supporters là array hợp lệ
      const eventToUpdate = {
        ...updateEventDto,
        supporters: Array.isArray(updateEventDto.supporters) 
          ? updateEventDto.supporters.filter(Boolean) 
          : []
      };

      const response = await axios.put(`${API_URL}/event/update/${id}`, eventToUpdate);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Event cannot be updated when ongoing or deleted');
      }
      throw error;
    }
  }
);

// Thêm action deleteEvent
export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string) => {
    try {
      const response = await axios.put(`${API_URL}/event/delete/${id}`);
      return id; // Trả về id để xóa khỏi state
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Event not found or already deleted');
      }
      throw error;
    }
  }
);

export const updateEventStatus = createAsyncThunk(
  'events/updateStatus',
  async ({ id, updateStatusDto }: { id: string; updateStatusDto: { eventStatus: string } }) => {
    const response = await axios.put(
      `/api/event/update-status/${id}`,
      updateStatusDto,
      {
        baseURL: process.env.NEXT_PUBLIC_API_URL
      }
    );
    return response.data;
  }
);

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  start: string;
  end: string;
  location: string;
  eventStatus: "SCHEDULED" | "ONGOING" | "COMPLETED";
  participants: string[];
  supporters: string[];
  createdAt: string;
  updatedAt: string;
}

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EventState = {
  events: [],
  currentEvent: null,
  status: "idle",
  error: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch events";
      })
      .addCase(fetchEventById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch event";
      })
      .addCase(createEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to create event";
      })
      .addCase(updateEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.events.findIndex(event => event._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update event';
      })
      .addCase(deleteEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = state.events.filter(event => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete event';
      })
      .addCase(updateEventStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.events.findIndex(event => event._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEventStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default eventSlice.reducer;
