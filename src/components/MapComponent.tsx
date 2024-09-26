import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet'

import "leaflet/dist/leaflet.css";
import { Icon } from 'leaflet';

interface location {
  latitude: number;
  longitude: number;
}

interface MapProps {
  focusMarker: location,
  otherMarkers?: location[],
  zoom: number;
}

const MapComponent: React.FC<MapProps> = ({ focusMarker, zoom, otherMarkers }) => {
  const ChangeMapCenter = ({ latitude, longitude }: { latitude: number, longitude: number }) => {
    const map = useMap();
    
    useEffect(() => {
      map.setView([latitude, longitude], map.getZoom(), {
        animate: true,
      });
    }, [latitude, longitude, map]);

    return null;
  }

  const bigIcon = new Icon({
    iconUrl: '/marker-icon-2x-blue.png', 
    iconSize: [25, 40], 
    iconAnchor: [17, 33],
  });

  const smallIcon = new Icon({
    iconUrl: '/marker-icon-orange.png', 
    iconSize: [19, 30], 
    iconAnchor: [12, 24],
  });

    
  return (
      <MapContainer center={[focusMarker.latitude, focusMarker.longitude]} zoom={zoom}  style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[focusMarker.latitude, focusMarker.longitude]} icon={bigIcon}>
          <Popup>
            Location: [{focusMarker.latitude}, {focusMarker.longitude}]
          </Popup>
        </Marker>
        {
          otherMarkers?.map((location) => (
            <Marker position={[location.latitude, location.longitude]} icon={smallIcon} key={location.latitude}>
              <Popup>
                Location: [{location.latitude}, {location.longitude}]
              </Popup>
          </Marker>
          ))
        }
        <ChangeMapCenter latitude={focusMarker.latitude} longitude={focusMarker.longitude} />
    </MapContainer>
  );
};

export default MapComponent;
