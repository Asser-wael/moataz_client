// features/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import { setNotification } from "./notificationSlice";
import { clearCart } from "./cartSlice";

export const getAdminOrders = createAsyncThunk("order/getAdminOrders", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/admin/orders");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const getOrderById = createAsyncThunk("order/getOrderById", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/admin/orders/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const getUserOrders = createAsyncThunk("order/getUserOrders", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/my-orders");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const checkOut = createAsyncThunk("order/checkOut", async (formData, { rejectWithValue, dispatch }) => {
  try {
    const token = localStorage.getItem("accessToken");

  
    if (!token) {
      const localCart = localStorage.getItem("cart");
      if (!localCart || JSON.parse(localCart).length === 0) {
        dispatch(setNotification({ message: "السلة فارغة حالياً", type: "error" }));
        return rejectWithValue("Cart is empty");
      }
      formData.append("cart", localCart);
    }

    const res = await api.post("/checkOut", formData);
    
    const trackingOrders = JSON.parse(localStorage.getItem("orderTracking")) || [];
    const newOrder = {
      orderId: res.data.order._id,
      status: "pending",
      time: new Date().toISOString()
    };
    trackingOrders.push(newOrder);
    localStorage.setItem("orderTracking", JSON.stringify(trackingOrders));

    dispatch(setNotification({ message: res.data.message, type: res.data.type }));
    dispatch(clearCart());
    if (token) dispatch(getUserOrders());

    return { order: res.data.order, newOrder };
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const updateOrderStatus = createAsyncThunk("order/updateOrderStatus", async ({ id, status }, { rejectWithValue, dispatch }) => {
  try {
    const res = await api.put("/updateOrderStatus", { id, status });
    dispatch(setNotification({ message: res.data.message, type: res.data.type }));
    return res.data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const getInitialTracking = () => JSON.parse(localStorage.getItem("orderTracking")) || [];

const orderSlice = createSlice({
  name: "orderSlice",
  initialState: {
    orders: [],           
    userOrders: [],        
    OrderTracking: getInitialTracking(), 
    id:null,
    order: null,           
    loading: false,
    error: null,
  },
  reducers: {
    updateTracking(state, action) {
      const { orderId, status } = action.payload;
      state.OrderTracking = state.OrderTracking.map(o => o.orderId === orderId ? { ...o, status } : o);
      localStorage.setItem("orderTracking", JSON.stringify(state.OrderTracking));
    },
    setOrderView(state, action) {
      state.id = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Checkout
      .addCase(checkOut.pending, (state) => { state.loading = true; })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.newOrder) state.OrderTracking.push(action.payload.newOrder);
      })
      .addCase(checkOut.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Get Admin Orders
      .addCase(getAdminOrders.fulfilled, (state, action) => { state.orders = action.payload;  console.log(state.orders);
      })
      
      // Get User Orders
      .addCase(getUserOrders.fulfilled, (state, action) => { state.userOrders = action.payload; })
      
      // Update Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
        
        const uIdx = state.userOrders.findIndex(o => o._id === action.payload._id);
        if (uIdx !== -1) state.userOrders[uIdx] = action.payload;
      });
  }
});

export const { updateTracking , setOrderView} = orderSlice.actions;
export default orderSlice.reducer;