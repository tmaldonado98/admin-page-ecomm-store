import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import OrderRegistry from './routes/OrderRegistry';
import ProdInventory from './routes/ProdInventory';
import { useMemo } from 'react';
import { AuthProvider, RequireAuth, useIsAuthenticated } from 'react-auth-kit'
// import RouteComponent from './routes';
// const isAuthenticated = useIsAuthenticated();



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <AuthProvider authType = {'cookie'}
            authName={'_auth'}
            cookieDomain={window.location.hostname}
            cookieSecure={false}> 
            {/* set cookieSecure to this when in production-> window.location.protocol === "https:" */}
            <BrowserRouter>
                  <Routes>
                        <Route exact path='/' element={<App />}/>
                        <Route path='/OrderRegistry' element={
                              <RequireAuth exact loginPath='/' authType='cookie' authName='_auth' cookieDomain={window.location.hostname} cookieSecure={false}>  
                              {/* set cookieSecure to true in production */}
                                    <OrderRegistry/>
                              </RequireAuth>
                        }></Route>

                        <Route path='/ProdInventory' element={
                              <RequireAuth exact loginPath='/'  authType='cookie' authName='_auth' cookieDomain={window.location.hostname} cookieSecure={false}>
                                    <ProdInventory/>
                              </RequireAuth>
                        }></Route>
                        
                  </Routes>
                  
            </BrowserRouter>  
      </AuthProvider>
</React.StrictMode>
);
