// admin.js (slice)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


export const getAllProducts = createAsyncThunk(
    "admin/getAllProducts",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await api.get("/admin/products", {
                headers: { Authorization: `Bearer ${token}` },
            })

            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.status);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "admin/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");

            const res = await api.delete(`/admin/products/deleteProduct/${id}`, {

                headers: { Authorization: `Bearer ${token}` },
            });

            return id; // رجّع id فقط
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const createProduct = createAsyncThunk(
    "admin/createProduct",
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const token = localStorage.getItem("accessToken");

            const res = await api.post(
                "/admin/products/createProduct",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await dispatch(getAllProducts());
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);
export const updateProduct = createAsyncThunk(
    "admin/updateProduct",
    async ({ id, formData }, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.put(`/admin/products/updateProduct/${id}`, formData)
            await dispatch(getAllProducts());
            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.status);
        }
    }
);
export const viewProduct = createAsyncThunk(
    "admin/viewProduct",
    async ({ id }, { rejectWithValue }) => {
        try {
            const res = await api.get(`/admin/products/viewProduct/${id}`)

            return res.data
        } catch (err) {
            return rejectWithValue(err.response?.status);
        }
    }
);
const productSlice = createSlice({
    name: "productSlice",
    initialState: {
        products: [],
        viewProduct: null,
        loadingGetAllProducts: false,
        loadingDelete: false,
        loadingCreateProduct: false,
        loadingView: false,
        loadingUpdateProduct: false,
        error: null,
    },
    reducers: {
        setIdEdit: (state, action) => {
            state.editid = action.payload;
        },
        setIdView: (state, action) => {
            state.IdView = action.payload;
        },
        // Search: (state, action) => {
        //     state.products = state.products.fi((e)=> e.productName ) ;
        // },

    },

    extraReducers: (builder) => {
        builder
            .addCase(viewProduct.pending, (state) => {
                state.loadingView = true;
            })
            .addCase(viewProduct.fulfilled, (state, action) => {
                state.viewProduct = action.payload;
                state.loadingView = false;
            })
            .addCase(viewProduct.rejected, (state, action) => {
                state.viewProduct = null;
                state.error = action.payload;
                state.loadingView = false;
            })
            .addCase(getAllProducts.pending, (state) => {
                state.loadingGetAllProducts = true;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loadingGetAllProducts = false;
                state.products = action.payload;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loadingGetAllProducts = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (p) => p._id !== action.payload
                );
                state.loadingDelete = false;
            })
            .addCase(deleteProduct.pending, (state, action) => {
                state.loadingDelete = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loadingCreateProduct = false;
            })
            .addCase(createProduct.pending, (state, action) => {
                state.loadingCreateProduct = true;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loadingUpdateProduct = true;
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.loadingUpdateProduct = false;
            })
            .addCase(updateProduct.rejected, (state) => {
                state.loadingUpdateProduct = false;
            })
        //   .addCase(deleteProduct.pending, (state) => {
        //     state.deletingProduct = true;
        //   })
        //   .addCase(deleteProduct.fulfilled, (state) => {
        //     state.deletingProduct = false;
        //     state.error = null;
        //   })
        //   .addCase(deleteProduct.rejected, (state, action) => {
        //     state.deletingProduct = false;
        //     state.error = action.payload;
        //   })


    },
});
export default productSlice.reducer;
// export const { Search } = productSlice.actions;