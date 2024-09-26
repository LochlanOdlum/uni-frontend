import { AppBar, Toolbar, Box, Button, Grid2 as Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import AdminButton from './AdminButton';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authToken = useSelector((state: RootState) => state.auth.token);

  const handleSignOut = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(logout());
  };


  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{flexGrow: 1}}>
          <Button color="inherit" component="div">
            <Link to={"/"} style={{textDecoration: "inherit", color: "inherit", font: "inherit", cursor: "inherit"}}> 
            Lochlan's Location Locator
            </Link>
          </Button>
        </Box>
        {!authToken &&
        <>
        <Grid container gap={"0.8rem"}>
            <Button disabled={false} variant="contained" sx={{backgroundColor: "rgb(205, 133, 49)"}} component="div">
              <Link to={"/signin"} style={{textDecoration: "inherit", color: "white", font: "inherit", cursor: "inherit"}}> 
                Sign In
              </Link>
            </Button>
            <Button disabled={false} variant="contained" sx={{backgroundColor: "rgb(205, 133, 49)"}} component="div">
              <Link to={"/signup"} style={{textDecoration: "inherit", color: "white", font: "inherit", cursor: "inherit"}}> 
                Sign Up
              </Link>
            </Button>
          </Grid>
        </>
        }
        {
          authToken && 
          <>
        <Grid container gap={"0.8rem"}>
            <AdminButton component="div">
              <Link to={"/users"} style={{textDecoration: "inherit", color: "white", font: "inherit", cursor: "inherit"}}> 
                Manage Users
              </Link>
            </AdminButton>
            <Button onClick={handleSignOut} disabled={false} variant="contained" sx={{backgroundColor: "rgb(205, 133, 49)"}} component="div">
                Sign Out
            </Button>
          </Grid>
        </>
        }

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
