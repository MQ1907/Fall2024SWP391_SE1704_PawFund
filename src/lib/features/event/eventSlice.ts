import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


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
      });
  },
});

export default eventSlice.reducer;
