// require('dotenv').config();
import * as React from 'react';
import {useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Forms.css';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Button from '@mui/material/Button';

console.log(process.env)
const firebaseConfig = {
  // your Firebase app configuration object
  // apiKey: process.env.REACT_APP_API_KEY ,
  apiKey: 'AIzaSyAg98s9T7TSlWTywldvgiFqUGlMZlcwy-U',
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

console.log(process.env.REACT_APP_API_KEY)
console.log(firebaseConfig)
console.log(firebaseConfig.apiKey)

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);



function App() {

  const [showPassword, setShowPassword] = useState(false);
    
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User is signed in
        const user = userCredential.user;
        console.log(`Logged in as ${user.email}`);
      })
      .catch((error) => {
        // Handle login error
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Login error: ${errorMessage}`);
      });
  };

React.useEffect(() => {
  console.log(email)
}, [email])

  return (
  <div className="App">
        <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      // noValidate
      autoComplete="off"
    >
      <div>
        <h1>Vea Collections - <br/> Administrative Control Panel</h1>
        <label>Admin User</label>
        <TextField id="filled-basic adminname email" value={email} placeholder="Admin User" variant="filled" onChange={(e) => setEmail(e.target.value)}/>
        
      </div>

      <div>
        <label>Admin Password</label>
        <FilledInput
              onChange={(e) => setPassword(e.target.value)}
              id="filled-adornment-password adminpass"
              type={showPassword ? 'text' : 'password'}
              placeholder="Admin Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
      </div>
      <div className='buttons'>
          <Button className='button' variant="outlined" size="large" onClick={handleLogin}>
            Login
          </Button>
        </div>
              {/* <TextField
          error
          id="filled-error-helper-text"
          label="Error"
          defaultValue="Hello World"
          helperText="Incorrect entry."
          variant="filled"
        /> */}
      </Box>   
          {/* <div id='buttons'>
            <Link to="/OrderRegistry">
              <LoginBtn />

              </Link> */}
              {/* instead of Link component, remove it and add a
              conditional redirect to the orderregistry component
              */}
            {/* <Link to="/DemoDashboard">
              <DemoLogin/>
            </Link>
          </div> */}
        
  </div>

  // {/* <Routes>  */}
      
      
  
      

  
  // </Routes>
  // </BrowserRouter>
  );
}

export default App;
