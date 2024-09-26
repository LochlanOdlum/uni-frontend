import { Stack, Typography } from '@mui/material';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

import HomeSelect from '../components/HomeSelect';
import LocationsTable from '../components/LocationsTable';
import MapComponent from '../components/MapComponent';
import { useGetHomesQuery, useGetLocationsQuery } from '../redux/services/api';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '../constants';

const HomePage = () => {
  const selectedHomeId = useSelector((state: RootState) => state.home.selectedHomeId);

  const { data: homes, error, isLoading, isFetching } = useGetHomesQuery(
    { skip: 0, limit: 100 }, 
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { 
    data: locations, 
    error: locationsError, 
    isLoading: locationsIsLoading, 
    isFetching: locationsIsFetching 
  } = useGetLocationsQuery(
    { skip: 0, limit: 100 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const selectedHome = useMemo(() => {
    if (!homes) return null;
    console.log(homes)
    return homes.find(home => home.id === selectedHomeId)
  }, [homes, selectedHomeId]);

  console.log(selectedHome?.id)

  return (
    <>
    <Stack spacing={3} alignItems="stretch">
      <HomeSelect />
      <div style={{ height: '360px', width: '100%', marginBottom: '20px' }}>
        <MapComponent 
          focusMarker={selectedHome ? selectedHome.address : {latitude: DEFAULT_LATITUDE, longitude: DEFAULT_LONGITUDE}}
          zoom={13}
          otherMarkers={locations?.filter(l => !selectedHome || l.id !== selectedHome.id).map(l => l.address) || undefined}
        />
      </div>
      <div>
        Locations
        <LocationsTable />
      </div>
    </Stack>
    </>
  );
};

export default HomePage;
