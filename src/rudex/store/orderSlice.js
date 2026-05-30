import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

/* ================= SEND ORDER ================= */
export const sendOrder = createAsyncThunk(
    "order/send",
    async ({ data, currentCart, totalprice }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("phoneNum", data.phoneNum);
            formData.append("totalPrice", totalprice);
            formData.append("currentCart", JSON.stringify(currentCart));

            if (data.photo?.[0]) {
                formData.append("photo", data.photo[0]);
            }

            const res = await api.post("/sendOrder", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ================= MY ORDERS ================= */
export const getMyOrders = createAsyncThunk(
    "order/my",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/myorder", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ================= ALL ORDERS (ADMIN) ================= */
export const getAllOrders = createAsyncThunk(
    "order/all",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/allOrders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);
export const updateStatus = createAsyncThunk(
    "order/updateStatus",
    async ({ status, id }, { rejectWithValue }) => {
        try {
            const res = await api.put("/updateStatus",
                {
                    id,
                    status,
                }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        myorders: [],
        allOrders: [],

        loading: false,
        error: null,
    },

    extraReducers: (builder) => {
        builder

            /* MY ORDERS */
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
            })

            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.myorders = action.payload;
            })

            /* ALL ORDERS */
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.allOrders = action.payload;
            })

            /* SEND ORDER */
            .addCase(sendOrder.fulfilled, (state) => {
                state.loading = false;
                state.guestCart = [];

                localStorage.removeItem("guestCart");
            })
            /* UPDATE STATUS */
            .addCase(updateStatus.fulfilled, (state, action) => {

                state.loading = false;

                const updatedOrder = action.payload;

                const index = state.allOrders.findIndex(
                    (item) => item._id === updatedOrder._id
                );

                if (index !== -1) {
                    state.allOrders[index] = updatedOrder;
                }
            });
    }
});

export default orderSlice.reducer;