import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddressForm from '../components/AddressForm';
import { Button, Typography, TextField, Grid2 as Grid } from '@mui/material';
import { components } from '../types/api';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useCreateLocationMutation,
  useGetLocationByIdQuery,
  useUpdateLocationMutation,
  // useGetHomeByIdQuery,
  useCreateHomeMutation,
  useGetHomeByIdQuery,
  useUpdateHomeMutation,
  // useUpdateHomeMutation,
} from '../redux/services/api'; // Adjust the import path as needed

export enum CreateOrEdit {
  Create = 'Create',
  Edit = 'Edit',
}

export enum HomeOrLocation {
  Home = 'Home',
  Location = 'Location',
}

export interface CreateOrEditHomeOrLocationProps {
  createOrEdit: CreateOrEdit;
  homeOrLocation: HomeOrLocation;
}


const CreateOrEditHomeOrLocation = ({createOrEdit, homeOrLocation}: CreateOrEditHomeOrLocationProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{id: string}>();

  // State for address
  const [address, setAddress] = useState<components['schemas']['AddressCreate']>({
    street: '',
    city: '',
    postal_code: '',
    country: '',
    latitude: null,
    longitude: null,
  });

  // State for location fields
  const [location, setLocation] = useState<
    Omit<components['schemas']['LocationCreate'], 'address'>
  >({
    name: '',
    summary: '',
    description: '',
    price_estimate_min: 0,
    price_estimate_max: 0,
  });

  // State for home fields
  const [home, setHome] = useState<Omit<components['schemas']['HomeCreate'], 'address'>>({
    name: '',
  });

  // Fetch existing data if editing
  const locationQueryResult = useGetLocationByIdQuery(
    createOrEdit === CreateOrEdit.Edit && homeOrLocation === HomeOrLocation.Location && id
      ? Number(id)
      : skipToken
  );
  const homeQueryResult = useGetHomeByIdQuery(
    createOrEdit === CreateOrEdit.Edit && homeOrLocation === HomeOrLocation.Home && id
      ? Number(id)
      : skipToken
  );

  // Initialize state when data is fetched when editing existing resource
  useEffect(() => {
    if (createOrEdit === CreateOrEdit.Edit) {
      if (homeOrLocation === HomeOrLocation.Location && locationQueryResult.data) {
        const data = locationQueryResult.data;
        setLocation({
          name: data!.name,
          summary: data!.summary,
          description: data!.description,
          price_estimate_min: data!.price_estimate_min,
          price_estimate_max: data!.price_estimate_max,
        });
        setAddress(data.address)
      } else if (homeOrLocation === HomeOrLocation.Home && homeQueryResult.data) {
        const data = homeQueryResult.data;
        setHome({
          name: data!.name,
        });
        setAddress(data.address)
      }
    }
  }, [createOrEdit, homeOrLocation, locationQueryResult.data, homeQueryResult.data]);

  // Mutation hooks
  const [createLocation, { isLoading: isCreatingLocation }] = useCreateLocationMutation();
  const [updateLocation, { isLoading: isUpdatingLocation }] = useUpdateLocationMutation();
  const [createHome, { isLoading: isCreatingHome }] = useCreateHomeMutation();
  const [updateHome, { isLoading: isUpdatingHome }] = useUpdateHomeMutation();

  // Submit handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (homeOrLocation === HomeOrLocation.Location) {
        const locationData: components['schemas']['LocationCreate'] = {
          ...location,
          address: address,
        };

        if (createOrEdit === CreateOrEdit.Create) {
          await createLocation(locationData).unwrap();
        } else {
          await updateLocation({ location_id: Number(id), data: locationData }).unwrap();
        }
      } else {
        const homeData: components['schemas']['HomeCreate'] = {
          ...home,
          address: address,
        };

        if (createOrEdit === CreateOrEdit.Create) {
          await createHome(homeData).unwrap();
        } else {
          await updateHome({ home_id: Number(id), data: homeData }).unwrap();
        }
      }
      
      navigate("/")
    } catch (err) {
      // Handle error
      console.error(err);
    }
  };

  const isLoading =
    (createOrEdit === CreateOrEdit.Edit &&
      ((homeOrLocation === HomeOrLocation.Location && locationQueryResult.isLoading)
       || (homeOrLocation === HomeOrLocation.Home && homeQueryResult.isLoading)
      )) ||
    isCreatingLocation ||
    isUpdatingLocation ||
    isCreatingHome ||
    isUpdatingHome;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h3">
        {createOrEdit} {homeOrLocation}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container direction={"column"} gap={"1rem"}>
          <AddressForm address={address} setAddress={setAddress} />

          {homeOrLocation === HomeOrLocation.Location && (
            <>
              <TextField
                label="Name"
                value={location.name}
                onChange={(e) => setLocation({ ...location, name: e.target.value })}
              />
              <TextField
                label="Summary"
                value={location.summary}
                onChange={(e) => setLocation({ ...location, summary: e.target.value })}
              />
              <TextField
                label="Description"
                value={location.description}
                onChange={(e) => setLocation({ ...location, description: e.target.value })}
              />
              <TextField
                label="Price Estimate Min"
                type="number"
                value={location.price_estimate_min}
                onChange={(e) =>
                  setLocation({ ...location, price_estimate_min: Number(e.target.value) })
                }
              />
              <TextField
                label="Price Estimate Max"
                type="number"
                value={location.price_estimate_max}
                onChange={(e) =>
                  setLocation({ ...location, price_estimate_max: Number(e.target.value) })
                }
              />
            </>
          )}

          {homeOrLocation === HomeOrLocation.Home && (
            <>
              <TextField
                label="Name"
                value={home.name}
                onChange={(e) => setHome({ ...home, name: e.target.value })}
              />
            </>
          )}

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, ...(homeOrLocation === HomeOrLocation.Location && {backgroundColor: "rgb(205, 133, 49)"}) }}>
            Submit
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default CreateOrEditHomeOrLocation;
