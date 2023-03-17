import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { BrowserRouter, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';

export default function Nav() {
  
  const signOut = useSignOut();
  const navigate = useNavigate();
  
  const logoutToLanding = () => {
    signOut();
    navigate('/');
    alert('You have been logged out.')
    console.clear();
  }

    return (
        <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          '& > *': {
            m: 1,
          },
        }}
      >

        <ButtonGroup variant="outline" aria-label="text button group">
          <Link to="/OrderRegistry">
            <Button>Order Registry</Button>
          </Link>
          <Link to="/ProdInventory">
            <Button>Inventory</Button>
          </Link>
            <Button onClick={logoutToLanding}>Sign Out</Button>
        </ButtonGroup>
       </Box>
    )
}

