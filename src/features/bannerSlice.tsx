import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

interface IBannerState {
  banners: IBanner[]
  bannerLoading: boolean
  bannerError: string | null
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
  bannerLoading: false,
  bannerError: null,
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
        state.bannerLoading = true
        state.bannerError = null
      })
      .addCase(
        readBanners.fulfilled,
        (state, action: PayloadAction<IBanner[]>) => {
          state.bannerLoading = false
          state.banners = action.payload
        }
      )
      .addCase(readBanners.rejected, (state, action) => {
        state.bannerLoading = false
        state.bannerError = action.error.message || 'banner read failed.'
      })
  },
})

export const { cleanBanners } = bannerSlice.actions

export const selectBanner = (state: RootState) => state.banner.banners

export default bannerSlice.reducer
