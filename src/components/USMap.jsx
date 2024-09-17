import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';



const USMap = () => {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        async function fetchGeoData() {
            try {
            const response = await fetch('http://localhost:3006/USA/');
            if(!response.ok) {
                console.error('Server error:', response.status, response.statusText);
                return;
            }
            setGeoData(response);
            } catch (error) {
            console.error('Error fetching the GeoJSON data', error);
          }
        }
        fetchGeoData();
    }, []);

  // Set the initial position and zoom level
  const position = [51.505, -0.09]; // Example coordinates for the map center

  return (
    <MapContainer center={position} zoom={2} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render GeoJSON data if available */}
      {<GeoJSON data={geoData} />}
    </MapContainer>
  );
};

export default USMap