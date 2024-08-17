import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

interface IBannerState {
  banners: IBanner[]
  loading: boolean
  error: string | null
}
// Async thunk middleware for reading data
export const readBanners = createAsyncThunk<IBanner[]>(
  'banner/readBanners',
  async () => {
    const { data } = await axios<IBanner[]>(
      import.meta.env.VITE_BASE_URL + '/banners'
    )
    return data
  }
)

const initialState: IBannerState = {
  banners: [],
  loading: false,
  error: null,
}

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    cleanBanners: (state) => {
      state.banners = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readBanners.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        readBanners.fulfilled,
        (state, action: PayloadAction<IBanner[]>) => {
          state.loading = false
          state.banners = action.payload
        }
      )
      .addCase(readBanners.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'banner read failed.'
      })
  },
})

export const { cleanBanners } = bannerSlice.actions

export const selectBanner = (state: RootState) => state.banner.banners

export default bannerSlice.reducer
