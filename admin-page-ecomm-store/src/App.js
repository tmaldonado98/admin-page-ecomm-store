import * as React from 'react';
import axios from 'axios';
import {useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Forms.css';
import './App.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useSignIn} from 'react-auth-kit';

function App() {

  const [showPassword, setShowPassword] = useState(false);
    
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidCreds, setInvalidCreds] = useState(true)

  const signIn = useSignIn();

  const navigate = useNavigate();
  
  const handleLogin = async () => {
    const token = [];
    try {
      const data = {email, password};
      const response = await axios.post('http://localhost:3003/login', data);
      if(response.status === 200){
        token.push(response.data.token)
        signIn({
          token: token[0],
          expiresIn: 3600,
          tokenType: 'Bearer',
          authState: { email: data.email}
        });
        navigate('/OrderRegistry')

      }    
      
    } catch (error){
      // alert("The credentials you provided could not be authenticated.")
      console.log(error)
      setInvalidCreds(false);

    }
  };

  React.useEffect(() => {
    if (password.length >= 5) {
      setInvalidCreds(true)
    }
  }, [password])

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
        <TextField id="filled-basic adminname email" value={email} 
            placeholder="Admin User" variant="filled" 
            onChange={(e) => setEmail(e.target.value)}
            autoComplete='false'
            autoSave='false'
            style={{color:'ivory'}}
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
              style={{color:'ivory'}}
              endAdornment={
                <InputAdornment position="end" style={{color:'ivory'}}>
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

            <Button style={{marginTop: '10px', color: 'ivory', backgroundColor:'#fffff02e', transition: '300ms ease-in-out'}} id='login' variant="outlined" size="large" onClick={handleLogin}>
              Login
            </Button>   
            <p hidden={invalidCreds} id='invalid-creds'>Invalid credentials. <br/> Enter the correct Admin email and password.</p>
      </div>
    </Box>          
  </div>

  );
}

export default App;
