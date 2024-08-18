import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface IProductsState {
  products: IProductData | null
  product: IProduct | null
  productLoading: boolean
  productError: string | null
}
// Async thunk for get all items
export const readProducts = createAsyncThunk<IProductData, IQuery | undefined>(
  'products/readProducts',
  async (query) => {
    const { data } = await axios<IProductData>(
      import.meta.env.VITE_BASE_URL + '/products',
      {
        params: query,
      }
    )
    return data
  }
)

// Async thunk for get single item
export const readSingleProduct = createAsyncThunk<IProduct, string>(
  'products/readSingleProduct',
  async (id) => {
    const { data } = await axios<IProduct>(
      import.meta.env.VITE_BASE_URL + `/products/${id}`
    )
    return data
  }
)

const initialState: IProductsState = {
  products: null,
  product: null,
  productLoading: false,
  productError: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = null
    },
    clearProduct: (state) => {
      state.product = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readProducts.pending, (state) => {
        state.productLoading = true
        state.productError = null
      })
      .addCase(
        readProducts.fulfilled,
        (state, action: PayloadAction<IProductData>) => {
          state.productLoading = false
          state.productError = null
          state.products = action.payload
        }
      )
      .addCase(readProducts.rejected, (state, action) => {
        state.productLoading = false
        state.productError = action.error.message || 'Products read failed..'
      })
      .addCase(readSingleProduct.pending, (state) => {
        state.productLoading = true
        state.productError = null
      })
      .addCase(
        readSingleProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.productLoading = false
          state.productError = null
          state.product = action.payload
        }
      )
      .addCase(readSingleProduct.rejected, (state, action) => {
        state.productLoading = false
        state.productError = action.error.message || 'Product read failed.'
      })
  },
})

export const { clearProducts, clearProduct } = productSlice.actions

export default productSlice.reducer
