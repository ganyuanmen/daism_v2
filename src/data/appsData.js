import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../api/client'

const initialState = {
    data: [], 
    status: 'idle',
    error: null,
}

export const getAppsData = createAsyncThunk('appsData/getAppsData', async (initialPost) => {
    // console.log("================getAppsData===================")
    // console.log(initialPost)
      const response = await client.post(initialPost.url, initialPost)
      return response.data
     
    }
  )
  
export const appsDataSlice = createSlice({
  name: 'appsData',
  initialState,
  reducers: {
    clearData: (state, action) => {
        state.data = [];
      },
  },
  extraReducers(builder) {
    builder
      .addCase(getAppsData.pending, (state, action) => {
        state.status = 'loading'
        state.error=null
      })
      .addCase(getAppsData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
        state.error=null
      })
      .addCase(getAppsData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})
export const { clearData } = appsDataSlice.actions
export default appsDataSlice.reducer
