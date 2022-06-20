import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
// import App from './App';
import { MapsApp } from './MapsApp';

mapboxgl.accessToken = 'pk.eyJ1IjoibW90b2NvbmNobzIiLCJhIjoiY2t3Z3pqc2lqMHRnZDMwcWJ3cHZ4ZnlqcCJ9.09n_zvQyE1r1vrge4JR8aA';


if( !navigator.geolocation ){
  alert('Tu navegador no tiene opcion de Geolocation');
  throw new Error('Tu navegador no tiene opcion de Geolocation')
}
 

ReactDOM.render(
  <React.StrictMode>
    <MapsApp />
  </React.StrictMode>,
  document.getElementById('root')
);

