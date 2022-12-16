import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import myStore from './service/myStore';
import { Provider } from 'react-redux';
//import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
     <Provider store={myStore}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

