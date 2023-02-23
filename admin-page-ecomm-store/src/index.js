import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import LoginBtn from './LoginBtn';
import DemoLogin from './DemoLogin';
import Dashboard from './routes/Dashboard';
import DemoDashboard from './routes/DemoDashboard';
import ProdInventory from './routes/ProdInventory';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        
    <BrowserRouter>
          <Routes>
                <Route exact path='/' element={<App />}/>
                <Route path='/Dashboard' element={<Dashboard/>}/>
                <Route path='/DemoDashboard' element={<DemoDashboard/>}/>
                <Route path='/ProdInventory' element={<ProdInventory/>}/>
            
          </Routes>
      
    </BrowserRouter>  
</React.StrictMode>
);
