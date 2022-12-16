import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../api/client'

const initialState = {
    pageData: [], 
    records:0,
    pages:0,
    status: 'idle',
    error: null,
}

export const getPageData = createAsyncThunk('pageData/getPageData', async (initialPost) => {
 //   console.log("================getPageData===================")
      const response = await client.post(initialPost.url, initialPost)
      return response.data
    }
  )
  
export const pageDataSlice = createSlice({
  name: 'pageData',
  initialState,
  reducers: {
    clearData: (state, action) => {
      state.pageData = [];
      state.pages=0;
      state.records=0;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPageData.pending, (state, action) => {
        state.status = 'loading'
        state.error=null
      })
      .addCase(getPageData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.pageData = action.payload.rows
        state.records=action.payload.total.mcount
        state.pages=action.payload.pages
        state.error=null
      })
      .addCase(getPageData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})
export const { clearData } = pageDataSlice.actions
export default pageDataSlice.reducer
