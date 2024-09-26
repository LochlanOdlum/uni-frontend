import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import { Stack } from '@mui/material';

import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CreateOrEditHomeOrLocation, { HomeOrLocation, CreateOrEdit } from './pages/CreateOrEditHomeOrLocation';
import UserManagement from './pages/userManagement';
// import { fetchHomes } from './redux/slices/homesSlice';
// import { fetchLocations } from './redux/slices/locationsSlice';

const App: React.FC = () => {
  // const dispatch = useDispatch();

  // Fetch homes and locations when the app loads
  // useEffect(() => {
  //   dispatch(fetchHomes());
  //   dispatch(fetchLocations());
  // }, [dispatch]);

  return (
    <Router>
      <CssBaseline />
      <Stack spacing={4} alignItems={"center"}>
        <Navbar />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/location/create" element={<CreateOrEditHomeOrLocation createOrEdit={CreateOrEdit.Create} homeOrLocation={HomeOrLocation.Location}/>} />
            <Route path="/location/edit/:id" element={<CreateOrEditHomeOrLocation createOrEdit={CreateOrEdit.Edit} homeOrLocation={HomeOrLocation.Location}/>} />
            <Route path="/location/:locationId" element={<LocationPage />} />
            <Route path="/home/create" element={<CreateOrEditHomeOrLocation createOrEdit={CreateOrEdit.Create} homeOrLocation={HomeOrLocation.Home}/>} />
            <Route path="/home/edit/:id" element={<CreateOrEditHomeOrLocation createOrEdit={CreateOrEdit.Edit} homeOrLocation={HomeOrLocation.Home}/>} />
            <Route path="/users" element={<UserManagement/>} />
          </Routes>
        </Container>
      </Stack>
    </Router>
  );
};

export default App;
