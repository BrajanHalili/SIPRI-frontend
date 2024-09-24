import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/US.css';


const USMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [countryName, setCountryName] = useState(null);
    let navigate = useNavigate();
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
            } catch (error) {
            console.error('Error fetching the GeoJSON data', error);
          }
        }
        fetchGeoData();
    }, []);

  // Set the initial position and zoom level
  const position = [51.505, -0.09]; // Example coordinates for the map center
  const countryStyle = {
    fillColor: '#3388ff', // Initial fill color
    weight: 2,
    opacity: 1,
    color: 'white', // Border color
    dashArray: '3',
    fillOpacity: 0.7, // Initial fill opacity
  };

  const onEachCountry = (country, layer) => {
      layer.bindTooltip(country.properties.name_long, { permanent: false, direction: 'center', className: 'country-tooltip' });
      layer.on({
        click: () => {
          setCountryName(country.properties.name_long);
        },
        mouseover: (e) => {
          layer.setStyle({
            fillColor: '#ff7800',
            fillOpacity: 0.7
          })
        },
        mouseout: (e) => {
          layer.setStyle({
            fillColor: '#3388ff',
            fillOpacity: 0.7
          })
        }
      });
  };

    const handleUpdate = (category) => {
      if(countryName != null){
        function fetchTradeData(category) {
          try {
            let link = 'http://localhost:3006/USA/' + countryName + '/' + category;
            console.log(link);
          const response = fetch(link);
          console.log(response);  // Inspect the entire response object
          if(!response.ok) {
              console.error('Server error:', response.status, response.statusText);
              return;
          }
          const data = response.json();
          } catch (error) {
          console.error('Error fetching the GeoJSON data', error);
        }
      }
      fetchTradeData(category);
      }
      else{
        alert("Please select a country");
      }
    }

  return (
    <div className="map-with-content-container">
      <div className='content-container'>
          <MapContainer center={position} zoom={2} style={{ height: '600px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geoData && (
          <GeoJSON data={geoData} onEachFeature={onEachCountry} style={countryStyle}/>
)}
          </MapContainer>
      </div>
      <div className='content-container'>
        <h3> United States arms sales to: {countryName}</h3>
        <h3> </h3>
        <div className='button-container'>
              <button onClick={() => handleUpdate('All')}> All: </button>
              <button onClick={() => alert(`Zoom to ${selectedCountry}`)}> Air defence: </button>
              <button onClick={() => alert(`Highlight ${selectedCountry}`)}>Armoured vehicles: </button>
              <button onClick={() => alert(`Highlight ${selectedCountry}`)}>Artillery:</button>
              <button onClick={() => alert(`Highlight ${selectedCountry}`)}>Aircraft: </button>
              <button onClick={() => alert(`Highlight ${selectedCountry}`)}>Sensors:</button>
              <button onClick={() => alert(`Highlight ${selectedCountry}`)}>Missiles:</button>
              <button onClick={() => alert(`Highlight ${selectedCountry}`)}>Ships:</button>
              <button onClick={() => alert(`Highlight ${selectedCountry}`)}>Naval weapons:</button>
              <button onClick={() => alert(`Highlight ${selectedCountry}`)}>Engines:</button>
              <button onClick={() => alert(`Highlight ${selectedCountry}`)}>Other:</button>
        </div>
      </div>
    </div>
    
  );
};

export default USMap;