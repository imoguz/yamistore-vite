import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface IProductsState {
  products: IProductData | null;
  product: IProduct | null;
  loading: boolean;
  error: string | null;
}
// Async thunk for get all items
export const readProducts = createAsyncThunk<IProductData, IQuery | undefined>(
  "products/readProducts",
  async (query) => {
    const { data } = await axios<IProductData>(
      import.meta.env.VITE_BASE_URL + "/products",
      {
        params: query,
      }
    );
    return data;
  }
);

// Async thunk for get single item
export const readSingleProduct = createAsyncThunk<IProduct, string>(
  "products/readSingleProduct",
  async (id) => {
    const { data } = await axios<IProduct>(
      import.meta.env.VITE_BASE_URL + `/products/${id}`
    );
    return data;
  }
);

const initialState: IProductsState = {
  products: null,
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = null;
    },
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readProducts.fulfilled,
        (state, action: PayloadAction<IProductData>) => {
          state.loading = false;
          state.error = null;
          state.products = action.payload;
        }
      )
      .addCase(readProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Products read failed..";
      })
      .addCase(readSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        readSingleProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.loading = false;
          state.error = null;
          state.product = action.payload;
        }
      )
      .addCase(readSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Product read failed.";
      });
  },
});

export const { clearProducts, clearProduct } = productSlice.actions;

export default productSlice.reducer;
