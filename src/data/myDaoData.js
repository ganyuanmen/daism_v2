import { createSlice } from '@reduxjs/toolkit'
import { client } from '../api/client'

const myDaoDataSlice = createSlice({
  name: 'myDaoData',
  initialState: {
    value: [],
    getting:false,
  },
  reducers: {
    setDaoData: (state, action) => {
      state.value = action.payload
    },
    setGetting(state, action){
      state.getting=action.payload;
    }
  },
})

export const { setDaoData,setGetting } = myDaoDataSlice.actions

export const getDaoData = (url,address) =>async (dispatch,getState) => {
    if(selectGetting(getState())) return;
    dispatch(setGetting(true));
    const response = await client.post(url + 'getDaoForAddress?_t=' + (new Date()).getTime(), {address});
    dispatch(setDaoData(response.data));
    dispatch(setGetting(false))
}

export const selectDaoData = (state) => state.myDaoData.value
export const selectGetting = (state) => state.myDaoData.getting

export default myDaoDataSlice.reducer
