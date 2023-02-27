import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import LoginBtn from './LoginBtn';
import DemoLogin from './DemoLogin';
import OrderRegistry from './routes/OrderRegistry';
import DemoDashboard from './routes/DemoDashboard';
import ProdInventory from './routes/ProdInventory';
import { useMemo } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        
    <BrowserRouter>
          <Routes>
                <Route exact path='/' element={<App />}/>
                <Route path='/OrderRegistry' element={<OrderRegistry/>}/>
                <Route path='/DemoDashboard' element={<DemoDashboard/>}/>
                <Route path='/ProdInventory' element={<ProdInventory/>}/>
            
          </Routes>
      
    </BrowserRouter>  
</React.StrictMode>
);
