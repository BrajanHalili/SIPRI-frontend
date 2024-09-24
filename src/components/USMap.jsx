import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/US.css';


const USMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [countryName, setCountryName] = useState(null);
    const bounds = [
      [-85, -180], // Southwest corner of the world (latitude, longitude)
      [85, 180] // Northeast corner of the world (latitude, longitude)
    ];
    const [tradeData, setTradeData] = useState();

    useEffect(() => {
        async function fetchGeoData() {
            try {
            const response = await fetch('http://localhost:3006/USA/');
            console.log(response);  // Inspect the entire response object
            if(!response.ok) {
                console.error('Server error:', response.status, response.statusText);
                return;
            }
            const mapData = await response.json();
            setGeoData(mapData);
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

    const handleUpdate = async (category) => {
      if(countryName != null){
        async function fetchTradeData(category) {
          try {
            let link = 'http://localhost:3006/USA/' + countryName + '/' + category;
            console.log(link);
          const response = await fetch(link);

          if(!response.ok) {
              console.error('Server error:', response.status, response.statusText);
              return;
          }  
          const trade = await response.json();
          setTradeData(trade);
          } catch (error) {
          console.error('Error fetching the trade register data', error);
        }
      }
      fetchTradeData(category);
      }
      else{
        alert("Please select a country");
      }
    };

  return (
    <div className="map-with-content-container">
      <div className='content-container'>
          <MapContainer center={position} zoom={2} style={{ height: '600px', width: '100%' }} maxBounds={bounds}>
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
              <button onClick={() => handleUpdate('Armoured vehicles')}>Armoured vehicles: </button>
              <button onClick={() => handleUpdate('Artillery')}>Artillery:</button>
              <button onClick={() => handleUpdate('Aircraft')}>Aircraft: </button>
              <button onClick={() => handleUpdate('Ships')}>Ships:</button>
              <button onClick={() => handleUpdate('Naval weapons')}>Naval weapons:</button>
              <button onClick={() => handleUpdate('Air defence systems')}> Air defence: </button>
              <button onClick={() => handleUpdate('Missiles')}>Missiles:</button>
              <button onClick={() => handleUpdate('Sensors')}>Sensors:</button>
              <button onClick={() => handleUpdate('Engines')}>Engines:</button>
              <button onClick={() => handleUpdate('Other')}>Other:</button>
        </div>
        {<table className="table table-hover">
                    <thead>
                        <tr className='table-primary'>
                            <th scope='col'>Order year</th>
                            <th scope='col'>Numbers ordered</th>
                            <th scope='col'>Designation</th>
                            <th scope='col'>Description</th>
                            <th scope='col'>Armament category</th>
                            <th scope='col'>Numbers delivered</th>
                            <th scope='col'>Delivery year/s</th>
                            <th scope='col'>Status</th>
                            <th scope='col'>Comments</th>
                            <th scope='col'>TIV per unit</th>
                            <th scope='col'>TIV total order</th>
                            <th scope='col'>TIV delivered weapons</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tradeData?.map(trade => (
                            <tr key={trade.id}>
                                <td>{}</td>
                                <td>{}</td>
                                <td>{}</td>
                                <td>{}</td>
                                <td>{}</td>
                                <td>{}</td>
                                <td>{}</td>
                            </tr>
                        ))}
                    </tbody>
          </table>}
      </div>
    </div>
    
  );
};

export default USMap;