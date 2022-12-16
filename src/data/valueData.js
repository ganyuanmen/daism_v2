import { createSlice } from '@reduxjs/toolkit'
import { propertis_zh } from '../locales/zh-CN';
import { propertis_en } from '../locales/en-US';

const initialState = {
    ethBalance:'0', 
    utokenBalance: '0',
    dethBalance: '0',
    tipText:'',
    messageText:'',
    language:window.sessionStorage.getItem("per")==='en'?propertis_en:propertis_zh,
}
  
export const valueDataSlice = createSlice({
  name: 'valueData',
  initialState,
  reducers: {
    setEthBalance: (state, action) => {
        state.ethBalance = action.payload;
      },
    setUtokenBalance: (state, action) => {
        state.utokenBalance = action.payload;
      },
    setDethBalance: (state, action) => {
        state.dethBalance = action.payload;
      },
    setTipText: (state, action) => {
        state.tipText = action.payload;
      },
    setMessageText: (state, action) => {
        state.messageText = action.payload;
      },
    setLanguage:(state, action) => {
      state.language = action.payload==='zh'?propertis_zh:propertis_en;
    },
  }
})

export const { setEthBalance,setUtokenBalance,setDethBalance,setTipText,setMessageText,setLanguage} = valueDataSlice.actions
export default valueDataSlice.reducer
