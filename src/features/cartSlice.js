import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import { setNotification } from "./notificationSlice";

const notify = (dispatch, res) => {
    try {
        dispatch(
            setNotification({
                message: res.data.message,
                type: res.data.type,
            })
        );
    } catch (err) {
        console.error("setNotification dispatch error:", err);
    }
};

const isLoggedIn = () => {
    try {
        return !!localStorage.getItem("accessToken");
    } catch {
        return false;
    }
};

const getGuestCart = () => {
    try {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.error("Failed to parse cart:", err);
        return [];
    }
};

const saveGuestCart = (cart) => {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
        console.error("Failed to save cart:", err);
    }
};


// ============ GET CART ============
export const getCart = createAsyncThunk(
    "cart/getCart",
    async (_, { rejectWithValue }) => {
        try {
            if (!isLoggedIn()) {
                return getGuestCart();
            }
            const res = await api.get("/cart");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Helper
const findIndex = (cart, item) => {
  return cart.findIndex(
    (i) =>
      i._id.toString() === item._id.toString() &&
      i.option === item.option
  );
};

// ============ ADD TO CART ============
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item, { rejectWithValue }) => {
    try {
      if (!isLoggedIn()) {
        const cart = getGuestCart();
        const index = findIndex(cart, item);

        if (index !== -1) {
          cart[index].count += 1;
        } else {
          cart.push({ ...item, count: 1 });
        }

        saveGuestCart(cart);
        return cart;
      }

      const res = await api.post("/cart/add", { ...item, count: 1 });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ============ INCREASE ============
export const increase = createAsyncThunk(
  "cart/increase",
  async (item, { rejectWithValue }) => {
    try {
      if (!isLoggedIn()) {
        const cart = getGuestCart();
        const index = findIndex(cart, item);

        if (index === -1) return cart;

        cart[index].count += 1;
        saveGuestCart(cart);
        return cart;
      }

      const res = await api.put("/cart/increase", item);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ============ DECREASE ============
export const decrease = createAsyncThunk(
  "cart/decrease",
  async (item, { rejectWithValue }) => {
    try {
      if (!isLoggedIn()) {
        const cart = getGuestCart();
        const index = findIndex(cart, item);

        if (index === -1) return cart;

        if (cart[index].count > 1) {
          cart[index].count -= 1;
        } else {
          cart.splice(index, 1);
        }

        saveGuestCart(cart);
        return cart;
      }

      const res = await api.put("/cart/decrease", item);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ============ REMOVE ITEM ============
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (item, { rejectWithValue }) => {
    try {
      if (!isLoggedIn()) {
        const cart = getGuestCart().filter(
          (i) =>
            !(
              i._id.toString() === item._id.toString() &&
              i.option === item.option
            )
        );

        saveGuestCart(cart);
        return cart;
      }

      const res = await api.delete("/cart/remove", { data: item });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);
// ============ CLEAR CART ============
export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            if (!isLoggedIn()) {
                saveGuestCart([]);
                try {
                    localStorage.removeItem("cart");
                } catch (err) {
                    console.error("Failed to remove cart from localStorage:", err);
                }
                return [];
            }

            await api.delete("/cart/clear");
            return [];
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const mergeCart = createAsyncThunk(
    "cart/mergeCart",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const guestCart = getGuestCart();

            if (!guestCart.length) {
                const res = await api.get("/cart");
                return res.data.data;
            }

            const res = await api.post("/cart/merge", { guestCart });
            notify(dispatch, res);

            try {
                localStorage.removeItem("cart");
            } catch (err) {
                console.error("Failed to clear guest cart after merge:", err);
            }

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        cart: getGuestCart(),
        loadingCart: false,
        error: null,
    },

    reducers: {
        // بيتنادى وقت اللوج آوت عشان يفضّي الكارت من الـ state بس (من غير كول للسيرفر)
        resetCartState: (state) => {
            state.cart = [];
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getCart.pending, (state) => {
                state.loadingCart = true;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loadingCart = false;
                state.cart = action.payload;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loadingCart = false;
                state.error = action.payload;
            })

            .addCase(addToCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(increase.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(increase.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(decrease.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(decrease.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(clearCart.fulfilled, (state) => {
                state.cart = [];
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(mergeCart.pending, (state) => {
                state.loadingCart = true;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loadingCart = false;
                state.cart = action.payload;
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loadingCart = false;
                state.error = action.payload;
            });
    },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;