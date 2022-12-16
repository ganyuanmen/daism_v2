import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../api/client'

const initialState = {
    data: {}, 
    oldData:{ 
        pro_index:0,
        pro_hash:'',
        pro_name:'',
        pro_type:1,
        is_myVote:0,
        total_vote:-1,
        votes:0,
        dao_index:0,
        dao_id:0,
        app_index:0,
        logo_img:'',
        function_name:'',
        function_para:'',
        app_address:'',
        cause_address:''},
    status: 'idle',
    error: null,
}

export const getMyProData = createAsyncThunk('myProData/getMyProData', async (initialPost) => {
    // console.log("================getMyProData===================")
    // console.log(initialPost)
      const response = await client.post(initialPost.url, initialPost)
      return response.data[0]
     
    }
  )
  
export const myProDataSlice = createSlice({
  name: 'myProData',
  initialState,
  reducers: {
    clearData: (state, action) => {
        state.data = [];
      },
  },
  extraReducers(builder) {
    builder
      .addCase(getMyProData.pending, (state, action) => {
        state.status = 'loading'
        state.error=null
      })
      .addCase(getMyProData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data =Object.assign(state.oldData, action.payload)
        state.error=null
      })
      .addCase(getMyProData.rejected, (state, action) => {
        state.status = 'failed'
        state.data=state.oldData;
        state.error = action.error.message
      })
  },
})
export const { clearData } = myProDataSlice.actions
export default myProDataSlice.reducer
