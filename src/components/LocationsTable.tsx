import { useMemo } from 'react';
import { useGetLocationsQuery, useGetDistancesQuery } from '../redux/services/api';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Grid2 as Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Link, useNavigate } from 'react-router-dom';
import AuthButton from './AuthButton';

const LocationsTable = () => {
  const navigate = useNavigate();

  const selectedHomeId = useSelector((state: RootState) => state.home.selectedHomeId);
  // Fetch locations data
  const { 
    data: locations, 
    error: locationsError, 
    isLoading: locationsIsLoading, 
  } = useGetLocationsQuery(
    { skip: 0, limit: 100 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Fetch distances data based on the selected home ID
  const { 
    data: distances, 
    error: distancesError, 
    isLoading: distancesIsLoading, 
  } = useGetDistancesQuery(
    selectedHomeId ?? 0, // Use 0 or a default value if selectedHomeId is null
    {
      refetchOnMountOrArgChange: true,
    }
  );


  const locationDistanceMap = useMemo(() => {
    if (!distances) return {};
    return distances.reduce<Record<string, number>>((accMap, distance) => {
      accMap[distance.destination_location_id] = distance.walking_distance_minutes;
      return accMap;
    }, {});
  }, [distances]);

  // Sort locations based on the walking distance
  const sortedLocationsByDistance = useMemo(() => {
    if (!locations) return [];

    return [...locations].sort((a, b) => {
      const distanceA = locationDistanceMap[a.id];
      const distanceB = locationDistanceMap[b.id];

      if (distanceA !== undefined && distanceB !== undefined) {
        return distanceA - distanceB; // Ascending order
      } else if (distanceA !== undefined) {
        return -1; // a comes before b
      } else if (distanceB !== undefined) {
        return 1; // b comes before a
      } else {
        return 0; // Maintain original order if both distances are undefined
      }
    });
  }, [locations, locationDistanceMap]);

  if (locationsIsLoading || distancesIsLoading) {
    return <div>Loading...</div>;
  }

  if (locationsError || distancesError) {
    return <div>Error loading data.</div>;
  }
  
  return (
    <Grid container gap={"0.7rem"}>
      <Grid container sx={{justifyContent: "flex-end", columnGap: "0.7rem", width: "100%"}}>
        <AuthButton disabled={false} variant="contained" sx={{backgroundColor: "rgb(205, 133, 49)"}} component="div">
          <Link to={'/location/create'} style={{textDecoration: "inherit", color: "white", font: "inherit", cursor: "inherit"}}> 
            Add Location
          </Link>
        </AuthButton>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Summary</TableCell>
              <TableCell>Price Range (GBP)</TableCell>
              <TableCell>Walking Distance (minutes)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLocationsByDistance && sortedLocationsByDistance.map((location) => (
              <TableRow 
                key={location.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f5f5f5', // Grey background on hover
                  },
                }}
                onClick={() => navigate(`/location/${location.id}`)}
              >
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.summary}</TableCell>
                <TableCell>£{location.price_estimate_min} - £{location.price_estimate_max}</TableCell>
                <TableCell>
                  {selectedHomeId !== null && locationDistanceMap[location.id] !== undefined 
                    ? locationDistanceMap[location.id] 
                    : "N/A"}
                </TableCell>    
              </TableRow> 
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
    );
};

export default LocationsTable;
