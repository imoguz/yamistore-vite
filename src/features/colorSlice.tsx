import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

interface IColorState {
  colors: IColor[]
  loading: boolean
  error: string | null
}
// Async thunk middleware for reading data
export const readColors = createAsyncThunk<IColor[]>(
  'color/readColors',
  async () => {
    const { data } = await axios<IColor[]>(
      import.meta.env.VITE_BASE_URL + '/colors'
    )
    return data
  }
)

const initialState: IColorState = {
  colors: [],
  loading: false,
  error: null,
}

const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    cleanColors: (state) => {
      state.colors = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(readColors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        readColors.fulfilled,
        (state, action: PayloadAction<IColor[]>) => {
          state.loading = false
          state.colors = action.payload
        }
      )
      .addCase(readColors.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Color read failed.'
      })
  },
})

export const { cleanColors } = colorSlice.actions

export const selectColor = (state: RootState) => state.color.colors

export default colorSlice.reducer
