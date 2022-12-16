import { configureStore } from '@reduxjs/toolkit';
import myDaoDataReducer from '../data/myDaoData';
import pageDataReducer from '../data/pageData';
import dataReducer from '../data/allData';
import appsDataReducer from '../data/appsData';
import valueDataReducer from '../data/valueData';
import myProDataReducer from '../data/myProData';


export default configureStore({
  reducer: {
    myDaoData: myDaoDataReducer,
    pageData: pageDataReducer,
    data:dataReducer,
    appsData:appsDataReducer,
    valueData:valueDataReducer,
    myProData:myProDataReducer,
  },
});
