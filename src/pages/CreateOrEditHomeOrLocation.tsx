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
  useCreateHomeMutation,
  useGetHomeByIdQuery,
  useUpdateHomeMutation,
  useLazySearchGeocodeQuery,
} from '../redux/services/api'; // Adjust the import path as needed
import { useSnackbar } from 'notistack';

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

const CreateOrEditHomeOrLocation = ({ createOrEdit, homeOrLocation }: CreateOrEditHomeOrLocationProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();

  const [address, setAddress] = useState<components['schemas']['AddressCreate']>({
    street: '',
    city: '',
    postal_code: '',
    country: '',
    latitude: null,
    longitude: null,
  });

  const [location, setLocation] = useState<
    Omit<components['schemas']['LocationCreate'], 'address'>
  >({
    name: '',
    summary: '',
    description: '',
    price_estimate_min: 0,
    price_estimate_max: 0,
  });

  const [home, setHome] = useState<Omit<components['schemas']['HomeCreate'], 'address'>>({
    name: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [createLocation, { isLoading: isCreatingLocation }] = useCreateLocationMutation();
  const [updateLocation, { isLoading: isUpdatingLocation }] = useUpdateLocationMutation();
  const [createHome, { isLoading: isCreatingHome }] = useCreateHomeMutation();
  const [updateHome, { isLoading: isUpdatingHome }] = useUpdateHomeMutation();

  const [
    triggerSearchGeocode,
    geocodeResult,
  ] = useLazySearchGeocodeQuery();

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
        setAddress(data.address);
      } else if (homeOrLocation === HomeOrLocation.Home && homeQueryResult.data) {
        const data = homeQueryResult.data;
        setHome({
          name: data!.name,
        });
        setAddress(data.address);
      }
    }
  }, [createOrEdit, homeOrLocation, locationQueryResult.data, homeQueryResult.data]);

  // Handle Calculate GeoCode
  const handleCalculateGeoCode = async () => {
    try {
      const response = await triggerSearchGeocode({
        search_term: `${address.street}, ${address.city}, ${address.postal_code}, ${address.country}`,
      }).unwrap(); // Use unwrap to handle errors

      setAddress((prevAddress) => ({
        ...prevAddress,
        latitude: response.latitude ?? prevAddress.latitude,
        longitude: response.longitude ?? prevAddress.longitude,
      }));
    } catch (err: any) {
      console.error('Geocode error:', err);
      setErrors((prevErrors) => ({
        ...prevErrors,
        geocode: 'Failed to calculate geocode.',
      }));
    }
  };

  // Update address state based on geocode result
  useEffect(() => {
    if (geocodeResult.data) {
      setAddress((prevAddress) => ({
        ...prevAddress,
        longitude: geocodeResult.data?.longitude ?? prevAddress.longitude,
        latitude: geocodeResult.data?.latitude ?? prevAddress.latitude,
      }));
    }
  }, [geocodeResult.data]);

  // Validation function
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Validate Address Fields
    if (!address.street.trim()) {
      newErrors.street = 'Street is required.';
      isValid = false;
    }
    if (!address.city.trim()) {
      newErrors.city = 'City is required.';
      isValid = false;
    }
    if (!address.postal_code.trim()) {
      newErrors.postal_code = 'Postal Code is required.';
      isValid = false;
    }
    if (!address.country.trim()) {
      newErrors.country = 'Country is required.';
      isValid = false;
    }
    // Optionally validate latitude and longitude if required

    // Validate Location or Home Fields
    if (homeOrLocation === HomeOrLocation.Location) {
      if (!location.name.trim()) {
        newErrors.name = 'Name is required.';
        isValid = false;
      }
      // Add more validations for location fields if needed
    } else {
      if (!home.name.trim()) {
        newErrors.name = 'Name is required.';
        isValid = false;
      }
      // Add more validations for home fields if needed
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle input changes for AddressForm and Parent Fields
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAddress({
      ...address,
      [name]: value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() ? '' : `${name.replace('_', ' ')} is required.`,
    }));
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLocation((prevLocation) => ({
      ...prevLocation,
      [name]: name.includes('price_estimate') ? Number(value) : value,
    }));

    if (name === 'name') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: value.trim() ? '' : 'Name is required.',
      }));
    }
  };

  const handleHomeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setHome({
      ...home,
      [name]: value,
    });

    if (name === 'name') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: value.trim() ? '' : 'Name is required.',
      }));
    }
  };

  // Submit handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Clear previous submission error
    setSubmitError(null);

    // If validation fails, do not proceed
    if (!validate()) {
      return;
    }

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
      enqueueSnackbar('Activity was successful!', { variant: 'success' });
      navigate('/');
    } catch (err: any) {
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
      setSubmitError(err?.data?.message || 'An error occurred while submitting the form.');
    }
  };

  // Loading state
  const isLoading =
    (createOrEdit === CreateOrEdit.Edit &&
      ((homeOrLocation === HomeOrLocation.Location && locationQueryResult.isLoading) ||
        (homeOrLocation === HomeOrLocation.Home && homeQueryResult.isLoading))) ||
    isCreatingLocation ||
    isUpdatingLocation ||
    isCreatingHome ||
    isUpdatingHome ||
    geocodeResult.isLoading ||
    geocodeResult.isFetching;

  // Early return for loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h3">
        {createOrEdit} {homeOrLocation}
      </Typography>
      
      {/* Display submission error if any */}
      {submitError && (
        <Typography color="error" variant="body1">
          {submitError}
        </Typography>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Grid container direction={'column'} gap={'1rem'}>
          <AddressForm
            address={address}
            setAddress={setAddress}
            errors={errors}
            handleInputChange={handleAddressInputChange}
            handleCalculateGeoCode={handleCalculateGeoCode}
            isGeocoding={geocodeResult.isLoading || geocodeResult.isFetching}
          />

          {homeOrLocation === HomeOrLocation.Location && (
            <>
              <TextField
                required
                label="Name"
                name="name" // Ensure the name attribute is present
                value={location.name}
                onChange={handleLocationInputChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
              <TextField
                label="Summary"
                name="summary" // Ensure the name attribute is present
                value={location.summary}
                onChange={handleLocationInputChange}
                error={Boolean(errors.summary)}
                helperText={errors.summary}
              />
              <TextField
                label="Description"
                name="description" // Ensure the name attribute is present
                value={location.description}
                onChange={handleLocationInputChange}
                error={Boolean(errors.description)}
                helperText={errors.description}
              />
              <TextField
                label="Price Estimate Min"
                type="number"
                name="price_estimate_min" // Ensure the name attribute is present
                value={location.price_estimate_min}
                onChange={handleLocationInputChange}
                error={Boolean(errors.price_estimate_min)}
                helperText={errors.price_estimate_min}
              />
              <TextField
                label="Price Estimate Max"
                type="number"
                name="price_estimate_max" // Ensure the name attribute is present
                value={location.price_estimate_max}
                onChange={handleLocationInputChange}
                error={Boolean(errors.price_estimate_max)}
                helperText={errors.price_estimate_max}
              />
            </>
          )}

          {homeOrLocation === HomeOrLocation.Home && (
            <>
              <TextField
                required
                label="Name"
                name="name" // Ensure the name attribute is present
                value={home.name}
                onChange={handleHomeInputChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              ...(homeOrLocation === HomeOrLocation.Location && { backgroundColor: 'rgb(205, 133, 49)' }),
            }}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default CreateOrEditHomeOrLocation;
