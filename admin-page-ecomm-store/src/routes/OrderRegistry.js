import * as React from 'react';
// import Stripe from 'stripe';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
// import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
// import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import { MDBBtn } from 'mdb-react-ui-kit';
import ProdInventory from './ProdInventory';
import {Link} from 'react-router-dom';
import Nav from '../Nav';
import Axios from 'axios';
import {useState, useEffect} from 'react';
// import { Buffer } from "buffer";
// require('dotenv').config();
// const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

// const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [balance, setBalance] = useState(null);

  // useEffect(() => {
  //   async function fetchBalance() {
  //     const balance = stripe.balance.retrieve()
  //     setBalance(balance)
  //   }

  //   fetchBalance();
  // }, [])

  useEffect(()=> {
    Axios.get('http://localhost:3003/getBalance')
    .then(response => setBalance(response.data))
    .then(response => console.log(response))
    .then(console.log(balance))
    // .then(result => console.log(result.data))
    .catch(error => alert(error))

  }, []);

  return (
    <ThemeProvider theme={mdTheme}>

      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
              ? theme.palette.grey[100]
                : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
              }}
        >
              <Nav/>
          {/* <Toolbar /> */}
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 350,
                  }}
                >
                  <div>
                    {balance ? 'state goes here' : <p>Loading...</p>}
                    {console.log(balance)}
                  </div>
                  {/* {console.log(rows)}
                  <div>
                      {rows ? ( 
                    <ul>

                    {rows.map(item=> (
                          <li key={item.prodkey}>{item.name}{item.medium}{item.size}{item.price}{(item.imgsrc.data.toString('base64'))}</li>
                    ))}
                    </ul>)
                     : ('Loading...')
                    }
                  </div> */}
                  {/* <Chart /> */}
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>

        </Box>
      </Box>
      
    </ThemeProvider>

                
  );
}

 function OrderRegistry() {
  return <DashboardContent />;
}

export default React.memo(OrderRegistry);