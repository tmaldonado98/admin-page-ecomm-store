import * as React from 'react';
import './OrderRegistry.css';
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
import { MDBBtn } from 'mdb-react-ui-kit';
import ProdInventory from './ProdInventory';
import {Link} from 'react-router-dom';
import Nav from '../Nav';
import Axios from 'axios';
import {useState, useEffect} from 'react';

import Title from './Title';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        Vea Collections
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




//exp def
function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3003/getBalance')
    .then(response => {
      setTransactions(response.data.data);
    })
    .then(response => console.log(response.data.data))

      // .then(console.log(transactions))
      .catch(error => {
        console.log(error);
      });
  }, []);
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

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

              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'fitContent',
                    width: '65%',
                    margin: 'auto',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" align="center" fontSize={'16px'}>
  
                    To view more information about your Stripe account balance, orders,
                    and payout status, log in to your Stripe account Dashboard at: <br/><br/>
                    <a href='https://dashboard.stripe.com/dashboard' target='_blank' rel="noreferrer, noopener"> Stripe Dashboard </a>
                    
                    
  
                  </Typography>
                </Paper>
              </Grid>

          <Container maxwidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
 {/* md={8} lg={9} */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
                  // sx={{
                  //   p: 2,
                  //   display: 'flex',
                  //   flexDirection: 'column',
                  //   height: 'fit-content',
                  //   width: '100%',
                  // }}
                 
                >
{transactions ? 
(
<>
  
                  <Title id="title">Recent Orders</Title>
                  <Table size="medium" display='unset' width='auto'>
                    <TableHead>
                      <TableRow maxwidth='inherit'>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Ship To</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell align="right">Sale Amount</TableCell>
                        <TableCell align="center">Contact</TableCell>
                        <TableCell align="center">Receipt</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map(each => (
                        <TableRow maxwidth='inherit' key={each.id}>
                          <TableCell>{formatDate(each.created)}</TableCell>
                          <TableCell>{each.billing_details.name}</TableCell>
                          <TableCell>{each.billing_details.address.city}, {each.billing_details.address.country} {each.billing_details.address.postal_code}</TableCell>
                          <TableCell>{each.payment_method_details.card.brand} {'•••• '+each.payment_method_details.card.last4}</TableCell>
                          <TableCell align="right">{`$${each.amount / 100}`}</TableCell>
                          <TableCell>{each.billing_details.email}</TableCell>
                          <TableCell id='receipt'>{each.receipt_url}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
</>
  )
                      : <p>Loading...</p>
                      }

                  {/* <Chart /> */}
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