import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

/* ================= GET USER ================= */
export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= RANDOM PRODUCTS ================= */
export const getRandomProducts = createAsyncThunk(
  "profile/getRandomProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/getProducts/random");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= PRODUCT DETAILS ================= */
export const getProdect = createAsyncThunk(
  "profile/getProdect",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/getProdect/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= GET DEALS ================= */
export const getDeals = createAsyncThunk(
  "profile/getDeals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/getProducts/deal");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);
export const getAllDeals = createAsyncThunk(
  "profile/getAllDeals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/getAllDeals");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);
export const getAllProducts = createAsyncThunk(
  "profile/getAllProducts",
  async ({ page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/getAllProducts?page=${page}&limit=${limit}`
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);
/* ================= SIMILAR ================= */
export const getSimilarProducts = createAsyncThunk(
  "profile/getSimilar",
  async ({ category }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/getProducts/random/${category}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= SLICE ================= */
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    userData: null,
    randomProducts: [],
    productDetails: null,
    
    deal: [],

    allDeals: [],

    similarProducts: [],

    allProducts: [],
    totalPages: 1,
    currentPage: 1,
    totalProducts: 0,

    loading: false,
    loadingRandom: false,
    loadingProduct: false,
    loadingDeal: false,
    loadingSimilar: false,

    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ALL PRODUCTS */
      .addCase(getAllProducts.pending, (state) => {
        state.loadingRandom = true;
      })

      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loadingRandom = false;
        state.allProducts = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalProducts = action.payload.totalProducts;
      })

      .addCase(getAllProducts.rejected, (state) => {
        state.loadingRandom = false;
      })
      /* USER */
      .addCase(getUser.fulfilled, (state, action) => {
        state.userData = action.payload;
      })

      /* RANDOM */
      .addCase(getRandomProducts.pending, (state) => {
        state.loadingRandom = true;
      })
      .addCase(getRandomProducts.fulfilled, (state, action) => {
        state.loadingRandom = false;
        state.randomProducts = action.payload.filter((e) => 
          e.productStock == "inStock");
      })

      /* PRODUCT */
      .addCase(getProdect.pending, (state) => {
        state.loadingProduct = true;
      })
      .addCase(getProdect.fulfilled, (state, action) => {
        state.loadingProduct = false;
        state.productDetails = action.payload;
      })

      /* DEALS */
      .addCase(getDeals.pending, (state) => {
        state.loadingDeal = true;
      })
      .addCase(getDeals.fulfilled, (state, action) => {
        state.loadingDeal = false;
        state.deal = action.payload;
      })
      .addCase(getAllDeals.fulfilled, (state, action) => {
        state.loadingDeal = false;
        state.allDeals = action.payload;
      })
      .addCase(getAllDeals.pending, (state) => {
        state.loadingDeal = true;
      })
      /* SIMILAR */
      .addCase(getSimilarProducts.fulfilled, (state, action) => {
        state.similarProducts = action.payload;
      });
  },
});

export default profileSlice.reducer;