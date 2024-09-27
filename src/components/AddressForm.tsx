// Remove the <Box component="form"> and its associated props
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
  errors: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCalculateGeoCode: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isGeocoding: boolean;
}

const AddressForm = ({ address, setAddress, errors, handleInputChange, handleCalculateGeoCode, isGeocoding }: AddressFormProps) => {
  const [
    triggerSearchGeocode, 
    geocodeResult,
  ] = useLazySearchGeocodeQuery();

  useEffect(() => {
    setAddress((address) => ({
      ...address,
      longitude: geocodeResult.data?.longitude ?? address.longitude ?? null,
      latitude: geocodeResult.data?.latitude ?? address.latitude ?? null,
    }));
  }, [geocodeResult.data?.latitude, geocodeResult.data?.longitude, setAddress]);

  return (
    <Grid container spacing={2}>
      <Grid size={5}>
        <MapComponent focusMarker={{latitude: address.latitude || DEFAULT_LATITUDE, longitude: address.longitude || DEFAULT_LONGITUDE}} zoom={14}/>
      </Grid>
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
            error={Boolean(errors.latitude)}
            helperText={errors.latitude}
          />
          <TextField
            sx={{width: "25%"}}
            fullWidth
            margin="normal"
            name="longitude"
            label="Longitude"
            value={address.longitude || ''}
            onChange={handleInputChange}
            error={Boolean(errors.longitude)}
            helperText={errors.longitude}
          />
          <Box sx={{justifyContent: "center", alignItems: "center", display: 'flex'}}>
            {isGeocoding ? (
              <CircularProgress sx={{ height: "100%"}} size={24} />
            ) : (
              <Button sx={{ height: "100%" }} onClick={handleCalculateGeoCode}>Auto Generate</Button>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AddressForm;
