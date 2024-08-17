import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface IWishlistState {
  wishlist: IWishlist[]
  wishLoading: boolean
  error: string | null
}
// Async thunk middleware for get
export const readWishlist = createAsyncThunk<IWishlist[], string>(
  'wishlist/readWishlist',
  async (id) => {
    const { data } = await axios<IWishlist[]>(
      import.meta.env.VITE_BASE_URL + `/wishlists`,
      {
        params: { userId: id },
      }
    )
    return data
  }
)

// Async thunk middleware for post
export const createWishlist = createAsyncThunk<
  void,
  { newWishlist: INewWishlist }
>('cart/createCart', async ({ newWishlist }) => {
  await axios.post(import.meta.env.VITE_BASE_URL + `/wishlists`, newWishlist)
})

// Async thunk middleware for delete
export const deleteWishlist = createAsyncThunk<void, string>(
  'wishlist/deleteWishlist',
  async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await axios.delete(import.meta.env.VITE_BASE_URL + `/wishlists/${id}`)
  }
)

const initialState: IWishlistState = {
  wishlist: [],
  wishLoading: false,
  error: null,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    cleanWishlist: (state) => {
      state.wishlist = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readWishlist.pending, (state) => {
        state.wishLoading = true
        state.error = null
      })
      .addCase(
        readWishlist.fulfilled,
        (state, action: PayloadAction<IWishlist[]>) => {
          state.wishLoading = false
          state.wishlist = action.payload
        }
      )
      .addCase(readWishlist.rejected, (state, action) => {
        state.wishLoading = false
        state.error = action.error.message || 'Wishlist read failed.'
      })
      .addCase(createWishlist.pending, (state) => {
        state.wishLoading = true
        state.error = null
      })
      .addCase(createWishlist.fulfilled, (state) => {
        state.wishLoading = false
      })
      .addCase(createWishlist.rejected, (state, action) => {
        state.wishLoading = false
        state.error = action.error.message || 'Wishlist creation failed.'
      })
      .addCase(deleteWishlist.pending, (state) => {
        state.wishLoading = true
        state.error = null
      })
      .addCase(deleteWishlist.fulfilled, (state) => {
        state.wishLoading = false
      })
      .addCase(deleteWishlist.rejected, (state, action) => {
        state.wishLoading = false
        state.error = action.error.message || 'Wishlist delete failed.'
      })
  },
})

export const { cleanWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
