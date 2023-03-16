import * as React from 'react';
import axios from 'axios';
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
import Button from '@mui/material/Button';
import { useSignIn, authUserState } from 'react-auth-kit';




function App() {

  const [showPassword, setShowPassword] = useState(false);
    
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = useSignIn();
  
  const handleLogin = async (e) => {
    // e.preventDefault();
    const data = {email, password};
    console.log(data)
    const response = await axios.post('http://localhost:3003/users/login', data)
    .catch(error => alert(error))
  //   if(signIn(
  //     {
  //         token: res.data.token,
  //         expiresIn:res.data.expiresIn,
  //         tokenType: "Bearer",
  //         authState: res.data.authUserState,
  //     }
  // )){
  //   console.log(response)
  //     // Redirect or do-something
  // }else {
  //     //Throw error
  //     console.log(error)
  // }

  //   try {
  //     // .then(console.log(response))
  //     // const signIn
  //     console.log(response)
  //     // signIn({
  //     //   token: response.data
  //     // })
    
  //   } catch (error) {
  //   }
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
        <TextField id="filled-basic adminname email" value={email} placeholder="Admin User" variant="filled" onChange={(e) => setEmail(e.target.value)}
            autoComplete='false'
            autoSave='false'
        />
        
      </div>

      <div>
        <label>Admin Password</label>
        <FilledInput
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='false'
              autoSave='false'
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
