
import React from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Form from './Form';
import LoginBtn from './LoginBtn';
import DemoLogin from './DemoLogin';
import Dashboard from './routes/Dashboard';
import DemoDashboard from './routes/DemoDashboard';

function App() {
  return (
  // <BrowserRouter>
  <>
    
        <div className="App">
          <Form />
        </div>  
    
          <div id='buttons'>
            <Link to="/Dashboard">
              <LoginBtn />
            </Link>
            <Link to="/DemoDashboard">
              <DemoLogin/>
            </Link>
          </div>
        
  </>

  // {/* <Routes>  */}
      
      
  
      

  
  // </Routes>
  // </BrowserRouter>
  );
}

export default App;
