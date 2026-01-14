import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseUrl from "../Urls";

// Fetch admin profile
export const fetchAdminProfile = createAsyncThunk(
  "profile/fetchAdminProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${baseUrl}/api/admin/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch admin metrics
export const fetchAdminMetrics = createAsyncThunk(
  "profile/fetchAdminMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${baseUrl}/api/admin/metrics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    adminProfile: null,
    metrics: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Admin Profile
    builder.addCase(fetchAdminProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.adminProfile = action.payload;
    });
    builder.addCase(fetchAdminProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Admin Metrics
    builder.addCase(fetchAdminMetrics.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminMetrics.fulfilled, (state, action) => {
      state.loading = false;
      state.metrics = action.payload;
    });
    builder.addCase(fetchAdminMetrics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, clearSuccessMessage } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
