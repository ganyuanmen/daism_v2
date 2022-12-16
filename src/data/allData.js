import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../api/client'

const initialState = {
    data: [], 
    status: 'idle',
    error: null,
}

export const getData = createAsyncThunk('data/getData', async (initialPost) => {
    // console.log("================getData===================")
    // console.log(initialPost)
      const response = await client.post(initialPost.url, initialPost)
      return response.data
     
    }
  )
  
export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearData: (state, action) => {
        state.data = [];
      },
  },
  extraReducers(builder) {
    builder
      .addCase(getData.pending, (state, action) => {
        state.status = 'loading'
        state.error=null
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
        state.error=null
      })
      .addCase(getData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})
export const { clearData } = dataSlice.actions
export default dataSlice.reducer
