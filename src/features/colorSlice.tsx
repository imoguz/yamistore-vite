import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

interface IColorState {
  colors: IColor[]
  colorLoading: boolean
  colorError: string | null
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
  colorLoading: false,
  colorError: null,
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
        state.colorLoading = true
        state.colorError = null
      })
      .addCase(
        readColors.fulfilled,
        (state, action: PayloadAction<IColor[]>) => {
          state.colorLoading = false
          state.colors = action.payload
        }
      )
      .addCase(readColors.rejected, (state, action) => {
        state.colorLoading = false
        state.colorError = action.error.message || 'Color read failed.'
      })
  },
})

export const { cleanColors } = colorSlice.actions

export const selectColor = (state: RootState) => state.color.colors

export default colorSlice.reducer
