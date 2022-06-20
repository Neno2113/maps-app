import axios from "axios";




const searchApi = axios.create({
    baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    params: {
        limit: 5,
        language: 'es',
        access_token: 'pk.eyJ1IjoibW90b2NvbmNobzIiLCJhIjoiY2t3Z3pqc2lqMHRnZDMwcWJ3cHZ4ZnlqcCJ9.09n_zvQyE1r1vrge4JR8aA'
    }
})




export default searchApi;