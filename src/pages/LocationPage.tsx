import React from 'react';
import { useParams } from 'react-router-dom';
import LocationDetails from '../components/LocationsDetails';

const LocationPage: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>(); // Extract the locationId from the URL

  return (
    <div>
      <LocationDetails locationId={Number(locationId!)} />
    </div>
  );
};

export default LocationPage;
