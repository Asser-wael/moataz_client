// admin.js (slice)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/api";


export const getAdminUsers = createAsyncThunk(
  "admin/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data; // users فقط
    } catch (err) {
      return rejectWithValue(err.response?.status);
    }
  }
);
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.delete(`/admin/deleteUser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // users فقط
    } catch (err) {
      return rejectWithValue(err.response?.status);
    }
  }
);



const adminSlice = createSlice({
  name: "adminSlice",
  initialState: {
    usersData: null,
    loadingUsers: false,
    loadingDeLete: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAdminUsers.pending, (state) => {
        state.loadingUsers = true;
      })
      .addCase(getAdminUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.usersData = action.payload;
      })
      .addCase(getAdminUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loadingDeLete = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loadingDeLete = false;
        state.usersData = state.usersData.filter(
          (user) => user._id !== action.payload
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loadingDeLete = false;
        state.error = action.payload;
      });
  },
});
export default adminSlice.reducer;
// export const { setIdEdit, setIdView } = Admin.actions;