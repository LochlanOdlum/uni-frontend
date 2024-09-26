import { Card, CardContent, Typography, Grid2 as Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useGetLocationByIdQuery, useDeleteLocationMutation } from '../redux/services/api';
import MapComponent from './MapComponent';
import AuthButton from './AuthButton';
import AdminButton from './AdminButton';

export interface LocationDetailsProps {
  locationId: number
}

const LocationDetails = ({ locationId }: LocationDetailsProps) => {
  const navigate = useNavigate();

  const { 
    data: location, 
    error: locationError, 
    isLoading: locationIsLoading, 
    isFetching: locationIsFetching 
  } = useGetLocationByIdQuery(
    locationId,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteLocation] = useDeleteLocationMutation();

  let errorText = ""
  if (locationIsFetching) {
    errorText = "is being fetched"
  } else if (locationIsLoading) {
    errorText = "is loading"
  } else if (locationError) {
    errorText = "has failed to load"
  }
  
  if (!location || errorText) {
    return <Typography variant="h5">Error loading {errorText}</Typography>;
  }

  return (
    <Grid container spacing={2} alignItems={"stretch"}>
      <Grid size={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">Map</Typography>
            <div style={{ height: '300px', backgroundColor: '#e0e0e0' }}><MapComponent focusMarker={location.address} zoom={14}/></div>
            <Typography variant="subtitle1" gutterBottom>
              Address
              <Typography variant="subtitle2">
                Street: {location.address.street}
              </Typography>
              <Typography variant="subtitle2">
                City: {location.address.city}
              </Typography>
              <Typography variant="subtitle2">
                Postal Code: {location.address.postal_code}
              </Typography>
              <Typography variant="subtitle2">
                Country: {location.address.country}
              </Typography>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Location details on the right */}
      <Grid size={6} height={"100%"} >
        <Grid container flexDirection={"column"} gap={"1rem"}>
          <Card>
            <CardContent>
              <Typography variant="h4">{location.name}</Typography>
              <Typography variant="subtitle1" gutterBottom>
                {location.summary}
              </Typography>
              <Typography variant="body1">{location.description}</Typography>
              <Typography variant="subtitle2" gutterBottom>
                Price Range: {location.price_estimate_min} - {location.price_estimate_max}
              </Typography>
            </CardContent>
          </Card>
          <Grid container sx={{justifyContent: "flex-end", columnGap: "0.7rem", width: "100%", height: "100%"}} alignSelf={"flex-end"}>
          <AdminButton onClick={() => locationId && deleteLocation(locationId) && navigate("/")}>Delete Location</AdminButton>
            <AuthButton disabled={false} variant="contained" sx={{backgroundColor: "rgb(205, 133, 49)"}} component="div">
              <Link to={`/location/edit/${locationId}`} style={{textDecoration: "inherit", color: "white", font: "inherit", cursor: "inherit"}}> 
                Edit Location
              </Link>
            </AuthButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LocationDetails;
