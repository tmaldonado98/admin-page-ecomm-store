
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Form from './Form';
import LoginBtn from './LoginBtn';
import AdminLogin from './AdminLogin';

function App() {
  return (
  <BrowserRouter>
  
      <div className="App">
        <Form />

        <div id='buttons'>
          <LoginBtn>
            <Link to="/Dashboard"/>
          </LoginBtn>
          <AdminLogin>
            <Link to="/DemoDashboard"/>
          </AdminLogin>
        </div>
      </div>
  </BrowserRouter>
  );
}

export default App;
