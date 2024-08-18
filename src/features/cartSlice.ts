import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface ICartState {
  cart: ICart[]
  cartLoading: boolean
  cartError: string | null
}

// thunk middleware for get
export const readCart = createAsyncThunk<ICart[], string>(
  'cart/readCart',
  async (id) => {
    const { data } = await axios<ICart[]>(
      import.meta.env.VITE_BASE_URL + `/carts`,
      {
        params: { userId: id },
      }
    )
    return data
  }
)

// Async thunk middleware for post
export const createCart = createAsyncThunk<void, { newCart: INewCart }>(
  'cart/createCart',
  async ({ newCart }) => {
    await axios.post(import.meta.env.VITE_BASE_URL + `/carts`, newCart)
  }
)

// Async thunk middleware for update
export const updateCart = createAsyncThunk<
  void,
  { updateCartItem: IUpdateCartItem }
>('cart/updateCart', async ({ updateCartItem }) => {
  await axios.put(
    import.meta.env.VITE_BASE_URL + `/carts/${updateCartItem.cartId}`,
    updateCartItem.data
  )
})

// Async thunk middleware for delete
export const deleteCart = createAsyncThunk<void, string>(
  'cart/deleteCart',
  async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await axios.delete(import.meta.env.VITE_BASE_URL + `/carts/${id}`)
  }
)

const initialState: ICartState = {
  cart: [],
  cartLoading: false,
  cartError: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    cleanCart: (state) => {
      state.cart = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readCart.pending, (state) => {
        state.cartLoading = true
        state.cartError = null
      })
      .addCase(readCart.fulfilled, (state, action: PayloadAction<ICart[]>) => {
        state.cartLoading = false
        state.cart = action.payload
      })
      .addCase(readCart.rejected, (state, action) => {
        state.cartLoading = false
        state.cartError = action.error.message || 'Cart read failed.'
      })
      .addCase(createCart.pending, (state) => {
        state.cartLoading = true
        state.cartError = null
      })
      .addCase(createCart.fulfilled, (state) => {
        state.cartLoading = false
      })
      .addCase(createCart.rejected, (state, action) => {
        state.cartLoading = false
        state.cartError = action.error.message || 'Cart creation failed.'
      })
      .addCase(updateCart.pending, (state) => {
        state.cartLoading = true
        state.cartError = null
      })
      .addCase(updateCart.fulfilled, (state) => {
        state.cartLoading = false
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.cartLoading = false
        state.cartError = action.error.message || 'Cart update failed.'
      })
      .addCase(deleteCart.pending, (state) => {
        state.cartLoading = true
        state.cartError = null
      })
      .addCase(deleteCart.fulfilled, (state) => {
        state.cartLoading = false
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.cartLoading = false
        state.cartError = action.error.message || 'Cart deletion failed.'
      })
  },
})

export const { cleanCart } = cartSlice.actions

export default cartSlice.reducer
