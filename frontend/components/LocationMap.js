'use client';

import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  marginBottom: '20px'
};

const defaultCenter = {
  lat: 28.6139, // Default to New Delhi
  lng: 77.2090
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

export default function LocationMap({ cars, serviceCenters, pickupPoints, center }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // If no API key is configured (e.g. on Netlify without the env var), show a placeholder
  if (!apiKey) {
    return (
      <div style={{ width: '100%', height: '400px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: '1rem' }}>
        <span style={{ fontSize: '3rem' }}>🗺️</span>
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Map unavailable — Google Maps API key not configured.</p>
      </div>
    );
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const [selectedElement, setSelectedElement] = useState(null);

  if (loadError) return <div>Error loading maps. Check your API key.</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center || defaultCenter}
        options={options}
      >
        {/* Render Cars */}
        {cars?.map((car) => (
          <Marker
            key={`car-${car.id}`}
            position={{ lat: car.latitude, lng: car.longitude }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
            onClick={() => setSelectedElement({ type: 'Car', data: car })}
          />
        ))}

        {/* Render Service Centers */}
        {serviceCenters?.map((center) => (
          <Marker
            key={`sc-${center.id}`}
            position={{ lat: center.latitude, lng: center.longitude }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
            onClick={() => setSelectedElement({ type: 'Service Center', data: center })}
          />
        ))}

        {/* Render Pickup Points */}
        {pickupPoints?.map((hub) => (
          <Marker
            key={`hub-${hub.id}`}
            position={{ lat: hub.latitude, lng: hub.longitude }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
            onClick={() => setSelectedElement({ type: 'Pickup Hub', data: hub })}
          />
        ))}

        {/* InfoWindow on marker click */}
        {selectedElement && (
          <InfoWindow
            position={{ lat: selectedElement.data.latitude, lng: selectedElement.data.longitude }}
            onCloseClick={() => setSelectedElement(null)}
          >
            <div style={{ color: 'black' }}>
              <h3>{selectedElement.type}: {selectedElement.data.name}</h3>
              {selectedElement.type === 'Car' ? (
                <>
                  <p>Brand: {selectedElement.data.brand}</p>
                  <p>Price: ₹{selectedElement.data.price}</p>
                </>
              ) : (
                <p>Address: {selectedElement.data.address}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <div className="map-legend" style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '14px' }}>
        <span>🔴 Cars</span>
        <span>🔵 Service Centers</span>
        <span>🟢 Pickup Hubs</span>
      </div>
    </div>
  );
}
