import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import { setNotification } from "./notificationSlice";

const notify = (dispatch, res) => {
    try {
        dispatch(setNotification({ message: res.data.message, type: res.data.type }));
    } catch (err) {
        console.error("setNotification dispatch error:", err);
    }
};

const isLoggedIn = () => {
    return !!localStorage.getItem("accessToken"); // أو userData حسب مشروعك
};

const getGuestFavorites = () => {
    try {
        const stored = localStorage.getItem("favorites");
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.error("Failed to parse favorites:", err);
        return [];
    }
};

const saveGuestFavorites = (favorites) => {
    try {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (err) {
        console.error("Failed to save favorites:", err);
    }
};

export const getFavorites = createAsyncThunk(
    "favorites/getFavorites",
    async (_, { rejectWithValue }) => {
        try {
            if (!isLoggedIn()) return getGuestFavorites();
            const res = await api.get("/favorites");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const addFavorite = createAsyncThunk(
    "favorites/addFavorite",
    async (product, { rejectWithValue }) => {
        try {
            if (!isLoggedIn()) {
                const favorites = getGuestFavorites();
                const exist = favorites.some((p) => p._id === product._id);
                if (!exist) favorites.push(product);
                saveGuestFavorites(favorites);
                return favorites;
            }
            const res = await api.post(`/favorites/${product._id}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const removeFavorite = createAsyncThunk(
    "favorites/removeFavorite",
    async (productId, { rejectWithValue }) => {
        try {
            if (!isLoggedIn()) {
                const favorites = getGuestFavorites().filter((p) => p._id !== productId);
                saveGuestFavorites(favorites);
                return favorites;
            }
            const res = await api.delete(`/favorites/${productId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const toggleFavorite = createAsyncThunk(
    "favorites/toggleFavorite",
    async (product, { rejectWithValue }) => {
        try {
            if (!isLoggedIn()) {
                const favorites = getGuestFavorites();
                const exist = favorites.some((p) => p._id === product._id);
                const updated = exist
                    ? favorites.filter((p) => p._id !== product._id)
                    : [...favorites, product];
                saveGuestFavorites(updated);
                return { data: updated, isFavorite: !exist };
            }
            const res = await api.post(`/favorites/toggle/${product._id}`);
            return { data: res.data.data, isFavorite: res.data.isFavorite };
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const favoritesSlice = createSlice({
    name: "favoritesSlice",
    initialState: {
        favorites: getGuestFavorites(),
        loadingFavorites: false,
        loadingToggle: false,
        error: null,
    },
    reducers: {
        resetFavoritesState: (state) => {
            state.favorites = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFavorites.pending, (state) => { state.loadingFavorites = true; })
            .addCase(getFavorites.fulfilled, (state, action) => {
                state.loadingFavorites = false;
                state.favorites = action.payload;
            })
            .addCase(getFavorites.rejected, (state, action) => {
                state.loadingFavorites = false;
                state.error = action.payload;
            })
            .addCase(addFavorite.fulfilled, (state, action) => { state.favorites = action.payload; })
            .addCase(addFavorite.rejected, (state, action) => { state.error = action.payload; })
            .addCase(removeFavorite.fulfilled, (state, action) => { state.favorites = action.payload; })
            .addCase(removeFavorite.rejected, (state, action) => { state.error = action.payload; })
            .addCase(toggleFavorite.pending, (state) => { state.loadingToggle = true; })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                state.loadingToggle = false;
                state.favorites = action.payload.data;
            })
            .addCase(toggleFavorite.rejected, (state, action) => {
                state.loadingToggle = false;
                state.error = action.payload;
            });
    },
});

export const { resetFavoritesState } = favoritesSlice.actions;
export default favoritesSlice.reducer;