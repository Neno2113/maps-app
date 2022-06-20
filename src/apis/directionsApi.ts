import axios from "axios";




const directionsApi = axios.create({
    baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',
    params: {
        alternatives: false,
        overview: 'simplified',
        geometries: 'geojson',
        steps: false,
        access_token: 'pk.eyJ1IjoibW90b2NvbmNobzIiLCJhIjoiY2t3Z3pqc2lqMHRnZDMwcWJ3cHZ4ZnlqcCJ9.09n_zvQyE1r1vrge4JR8aA'
    }
})




export default directionsApi;