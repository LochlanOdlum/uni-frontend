import React, { useState, useEffect } from 'react';
import { TextField, Box, Button, Grid2 as Grid, CircularProgress } from '@mui/material';

import { components } from '../types/api';
import MapComponent from './MapComponent';
import { useLazySearchGeocodeQuery } from '../redux/services/api';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../constants';

export interface AddressFormProps {
  address: components['schemas']['AddressCreate'];
  setAddress: React.Dispatch<
    React.SetStateAction<components['schemas']['AddressCreate']>
  >;
}

// Suported countries
// const countries = [
//   { code: 'GB', label: 'United Kingdom' },
//   // { code: 'US', label: 'United States' },
//   // { code: 'CA', label: 'Canada' },
//   // Add more countries here
// ];

const AddressForm = ({ address, setAddress }: AddressFormProps) => {
  const [
    triggerSearchGeocode, 
    geocodeResult,
  ] = useLazySearchGeocodeQuery();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setAddress((address) => ({
      ...address,
      longitude: geocodeResult.data?.longitude ?? address.longitude ?? null,
      latitude: geocodeResult.data?.latitude ?? address.latitude ?? null ,
    }))

  }, [geocodeResult.data?.latitude, geocodeResult.data?.longitude, ])

  const validateField = (name: string, value: string) => {
    let error = '';

    if (!value.trim()) {
      error = `${name} is required.`;
    } else {
      // Additional validation logic based on field
      // if (name === 'postal_code' && !/.test(value)) {
      //   error = 'Invalid postal code format.';
      // }
    }

    return error;
  };

  // Updates state, validates it and then sets any errors to disply in UI
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAddress({
      ...address,
      [name]: value,
    });

    const error = validateField(name, value);

    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.entries(address).forEach(([key, value]) => {
      const error = validateField(key, value as string);
      if (error) {
        isValid = false;
        newErrors[key] = error;
      }
    });

    // Only send request if fields are valid
    if (isValid) {
      console.log('Form submitted successfully:', address);
    } else {
      setErrors(newErrors);
    }
  };

  const handleCalculateGeoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearchGeocode({ search_term: `${address.street}, ${address.city}, ${address.postal_code}, ${address.country}`});
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid size={5}><MapComponent focusMarker={{latitude: address.latitude || DEFAULT_LATITUDE, longitude: address.longitude || DEFAULT_LONGITUDE}} zoom={14}/></Grid>
        <Grid size={5}>
          <TextField
            required
            fullWidth
            margin="normal"
            name="street"
            label="Street"
            value={address.street || ''}
            onChange={handleInputChange}
            error={Boolean(errors.street)}
            helperText={errors.street}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="city"
            label="City"
            value={address.city || ''}
            onChange={handleInputChange}
            error={Boolean(errors.city)}
            helperText={errors.city}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="postal_code"
            label="Postal Code"
            value={address.postal_code || ''}
            onChange={handleInputChange}
            error={Boolean(errors.postal_code)}
            helperText={errors.postal_code}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="country"
            label="Country"
            value={address.country || ''}
            onChange={handleInputChange}
            error={Boolean(errors.country)}
            helperText={errors.country}
          />
          <Box sx={{ display: 'inline-flex', width: "100%", gap: "5%"}}>
            <TextField
              sx={{width: "25%"}}
              fullWidth
              margin="normal"
              name="latitude"
              label="Latitude"
              value={address.latitude || ''}
              onChange={handleInputChange}
              error={Boolean(errors.country)}
              helperText={errors.country}
            />
            <TextField
              sx={{width: "25%"}}
              fullWidth
              margin="normal"
              name="longitude"
              label="Longitude"
              value={address.longitude || ''}
              onChange={handleInputChange}
              error={Boolean(errors.country)}
              helperText={errors.country}
            />
            <Box sx={{justifyContent: "center", alignItems: "center",}}>
              {geocodeResult.isLoading || geocodeResult.isFetching ? (
              <CircularProgress sx={{ height: "100%"}} size={24} />
                ) : (<Button sx={{ height: "100%" }} onClick={handleCalculateGeoCode}>Auto Generate</Button>)
              }
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressForm;
