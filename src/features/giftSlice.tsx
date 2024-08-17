import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

interface IGiftState {
  gifts: IGift[]
  giftLoading: boolean
  error: string | null
}
// Async thunk middleware for reading data
export const readGifts = createAsyncThunk<IGift[]>(
  'gift/readGifts',
  async () => {
    const { data } = await axios<IGift[]>(
      import.meta.env.VITE_BASE_URL + '/gifts'
    )
    return data
  }
)

const initialState: IGiftState = {
  gifts: [],
  giftLoading: false,
  error: null,
}

const giftSlice = createSlice({
  name: 'gift',
  initialState,
  reducers: {
    cleanGifts: (state) => {
      state.gifts = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readGifts.pending, (state) => {
        state.giftLoading = true
        state.error = null
      })
      .addCase(readGifts.fulfilled, (state, action: PayloadAction<IGift[]>) => {
        state.giftLoading = false
        state.gifts = action.payload
      })
      .addCase(readGifts.rejected, (state, action) => {
        state.giftLoading = false
        state.error = action.error.message || 'Gift read failed.'
      })
  },
})

export const { cleanGifts } = giftSlice.actions

export const selectGift = (state: RootState) => state.gift.gifts

export default giftSlice.reducer
