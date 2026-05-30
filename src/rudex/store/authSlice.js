import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import axios from "axios";
import { getUser } from "./profileSlice";

/* ================= REGISTER ================= */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/register", formData);
      return { data: res.data, status: res.status };
    } catch (err) {
      return rejectWithValue({
        data: err.response?.data,
        status: err.response?.status,
      });
    }
  }
);

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/login", data);
      
      const token = res.data.accessToken;
      
      localStorage.setItem("accessToken", token);
      
      // مهم جدًا: تأكد التوكن اتخزن الأول
      await dispatch(getUser()).unwrap();
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.status);
    }
  }
);
/* ================= LOGOUT ================= */
const API_URL = import.meta.env.VITE_API_URL;
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("accessToken");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);
/* ================= SEND OTP ================= */
export const sendResetOtp = createAsyncThunk(
  "auth/sendResetOtp",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/resetPassword", { email });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= VERIFY OTP ================= */
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/verifyOtp", data);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= SLICE ================= */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: null,
    loadingLogin: false,
    loadingRegister: false,
    loadingLogout: false,
    loadingReset: false,
    loadingVerifyOtp: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      /* SEND OTP */
      .addCase(sendResetOtp.pending, (state) => {
        state.loadingReset = true;
      })
      .addCase(sendResetOtp.fulfilled, (state) => {
        state.loadingReset = false;
      })
      .addCase(sendResetOtp.rejected, (state) => {
        state.loadingReset = false;
      })

      /* VERIFY OTP */
      .addCase(verifyOtp.pending, (state) => {
        state.loadingVerifyOtp = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loadingVerifyOtp = false;
      })
      .addCase(verifyOtp.rejected, (state) => {
        state.loadingVerifyOtp = false;
      })
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loadingLogin = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loadingLogin = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loadingLogin = false;
        state.error = action.payload;
      })

      /* REGISTER */
      .addCase(registerUser.pending, (state) => {
        state.loadingRegister = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loadingRegister = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loadingRegister = false;
        state.error = action.payload;
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.userData = null;
      });
  },
});

export default authSlice.reducer;