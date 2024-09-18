import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';



const USMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [country, setCountry] = useState(null);
    const geoJsonData = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [[[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [102.0, 0.0]]]
          },
          "properties": {
            "name": "Test Country",
            "country_code": "TC"
          }
        }
      ]
    };
    useEffect(() => {
        async function fetchGeoData() {
            try {
            const response = await fetch('http://localhost:3006/USA/');
            console.log(response);  // Inspect the entire response object
            if(!response.ok) {
                console.error('Server error:', response.status, response.statusText);
                return;
            }
            const data = await response.json();
            setGeoData(data);
            console.log(geoData);
            } catch (error) {
            console.error('Error fetching the GeoJSON data', error);
          }
        }
        fetchGeoData();
    }, []);

  // Set the initial position and zoom level
  const position = [51.505, -0.09]; // Example coordinates for the map center

  const onEachCountry = (country, layer) => {
      layer.on({
        click: () => {
          setCountry(country.properties);
          console.log('Country clicked: ', country.properties);
        }
      });
  };

  return (
    <div>
      <div>
          <MapContainer center={position} zoom={2} style={{ height: '500px', width: '50%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geoData && (
          <GeoJSON data={geoData} onEachFeature={onEachCountry} />
)}
          </MapContainer>
      </div>
      <div>

      </div>
    </div>
    
  );
};

export default USMap