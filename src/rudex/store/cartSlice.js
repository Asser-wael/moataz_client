import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

/* ================= AUTH HEADER ================= */

const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
});

/* ================= ASYNC THUNKS ================= */

// GET CART
export const getCart = createAsyncThunk(
    "cart/getCart",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/cart", getAuthHeader());
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.status);
        }
    }
);

// ADD TO CART
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.put(
                `/addToCart/${id}`,
                {},
                getAuthHeader()
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.status);
        }
    }
);

// REMOVE FROM CART
export const RemoveFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.delete(
                `/deletFromCart/${id}`,
                getAuthHeader()
            );

            dispatch(getCart());
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.status);
        }
    }
);

// DECREASE QUANTITY
export const decreaseQuantity = createAsyncThunk(
    "cart/decreaseQuantity",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.put(
                `/decreaseFromCart/${id}`,
                {},
                getAuthHeader()
            );

            dispatch(getCart());
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.status);
        }
    }
);

/* ================= SLICE ================= */

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        guestCart: JSON.parse(localStorage.getItem("guestCart")) || [],
        totalprice: 0,
        loading: false,
        error: null,
        buyNow: null,
    },
    reducers: {
        setBuyNow: (state, action) => {
            state.buyNow = action.payload;
        },
        /* ================= GUEST CART ================= */

        addGuestCart: (state, action) => {
            const product = action.payload;

            const existing = state.guestCart.find(
                (item) => item._id === product._id
            );

            if (existing) {
                existing.quantity += 1;
            } else {
                state.guestCart.push({
                    ...product,
                    quantity: 1,
                });
            }

            localStorage.setItem(
                "guestCart",
                JSON.stringify(state.guestCart)
            );
        },

        removeGuestCart: (state, action) => {
            state.guestCart = state.guestCart.filter(
                (item) => item._id !== action.payload
            );

            localStorage.setItem(
                "guestCart",
                JSON.stringify(state.guestCart)
            );
        },

        clearGuestCart: (state) => {
            state.guestCart = [];
            localStorage.removeItem("guestCart");
        },
        decreaseGuestQuantity: (state, action) => {
            const productId = action.payload;

            const item = state.guestCart.find(
                (item) => item._id === productId
            );

            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.guestCart = state.guestCart.filter(
                        (item) => item._id !== productId
                    );
                }

                localStorage.setItem(
                    "guestCart",
                    JSON.stringify(state.guestCart)
                );
            }
        },
    },



    extraReducers: (builder) => {
        builder

            /* ================= GET CART ================= */
            .addCase(addToCart.fulfilled, (state, action) => {
                state.cart = action.payload.cart;
            })
            .addCase(getCart.pending, (state) => {
                state.loading = true;
            })

            .addCase(getCart.fulfilled, (state, action) => {
                state.cart = action.payload.cart;
                state.totalprice = action.payload.totalPrice;
                state.loading = false;
            })

            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    addGuestCart,
    removeGuestCart,
    clearGuestCart,
    decreaseGuestQuantity, setBuyNow // 👈 أضفها هنا
} = cartSlice.actions;


export default cartSlice.reducer;