import React, { useState, useEffect, MouseEventHandler } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, FormHelperText, Grid2 as Grid, Button } from '@mui/material';
import { useDeleteHomeMutation, useGetHomesQuery } from '../redux/services/api';
import { components } from '../types/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setHomeId } from '../redux/slices/homeSlice';
import { SelectChangeEvent } from '@mui/material/Select';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import AdminButton from './AdminButton';
import { skipToken } from '@reduxjs/toolkit/query';

// Define the type for HomeRead for clarity
type HomeRead = components['schemas']['HomeRead'];

const HomeSelect: React.FC = () => {
  const dispatch = useDispatch();

  const selectedHomeId = useSelector((state: RootState) => state.home.selectedHomeId);
  const { data: homes, error, isLoading, isFetching } = useGetHomesQuery(
    { skip: 0, limit: 100 }, 
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [deleteHome] = useDeleteHomeMutation();

  const handleChange = (event: SelectChangeEvent<number | ''>) => {
    const value = event.target.value;
    // Ensure the value is a number before setting it
    dispatch(setHomeId(typeof value === 'number' ? value : null))
  };

  // Set default selected home to the first, once list is loaded
  useEffect(() => {
    if (homes && homes.length > 0 && selectedHomeId === null) {
      dispatch(setHomeId(homes[0].id))
    }
  }, [homes, selectedHomeId]);

  return (
    <>
      <Grid container sx={{justifyContent: "flex-end", columnGap: "0.7rem"}}>
        <AdminButton onClick={() => selectedHomeId && deleteHome(selectedHomeId)}>
          Delete Selected Home
        </AdminButton>
      <AuthButton disabled={false} variant="contained" color="primary" component="div">
          <Link to={`/home/edit/${selectedHomeId}`} style={{textDecoration: "inherit", color: "inherit", font: "inherit", cursor: "inherit"}}> 
            Update Selected Home
          </Link>
        </AuthButton>
        <AuthButton disabled={false} variant="contained" color="primary" component="div">
          <Link to={"/home/create"} style={{textDecoration: "inherit", color: "inherit", font: "inherit", cursor: "inherit"}}> 
            Add Home
          </Link>
        </AuthButton>
      </Grid>
      <FormControl fullWidth variant="outlined" disabled={isLoading || isFetching} error={Boolean(error)}>
        <InputLabel id="home-select-label">Select Home</InputLabel>
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Select
            labelId="home-select-label"
            id="home-select"
            value={selectedHomeId === null ? '' : selectedHomeId}
            onChange={handleChange}
            label="Select Home"
          >
            {homes && homes.length > 0 ? (
              homes.map((home: HomeRead) => (
                <MenuItem key={home.id} value={home.id}>
                  {home.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No homes available
              </MenuItem>
            )}
          </Select>
        )}
        {/* Display error message if there's an error */}
        {error && <FormHelperText>Error fetching homes.</FormHelperText>}
      </FormControl>

    </>
  );
};

export default HomeSelect;
