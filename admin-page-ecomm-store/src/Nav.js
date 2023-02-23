import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

export default function Nav() {
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
          <Link to="/Dashboard">
            <Button>Dashboard</Button>
          </Link>
          <Link to="/ProdInventory">
            <Button>Inventory</Button>
          </Link>
          {/* <Link to="/Signout">*/}
            <Button>Sign Out</Button>
          {/* </Link>  */}
        </ButtonGroup>
       </Box>
    )
}

