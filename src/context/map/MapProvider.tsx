import { AnySourceData, LngLatBounds, Map, Marker, Popup } from "mapbox-gl";
import { useCallback, useContext, useEffect, useReducer } from "react";
import { PlacesContext } from "..";
import { directionsApi } from "../../apis";
import { DirectionsResponse } from "../../interfaces/directions";
import { MapContext } from "./MapContext";
import { mapReducer } from "./mapReducer";


export interface MapState {
    isMapReady: boolean;
    map?: Map;
    markers: Marker[];
    
}


const Initial_State : MapState ={
    isMapReady: false,
    map: undefined,
    markers: [],

}

interface Props {
    children: JSX.Element | JSX.Element[];
   
}


export const MapProvider = ({ children }: Props ) => {

    const [ mapState, dispatch ] = useReducer(mapReducer, Initial_State);
    const { places } = useContext( PlacesContext );


    useEffect(() => {
        mapState.markers.forEach( marker => marker.remove() );
        const newMarkers: Marker[] = [];
        
        for (const place of places) {
            const [ lng, lat ] = place.center;
            const popup = new Popup()
                .setHTML(`
                    <h6>${ place.text_es }</h6>
                    <p>${ place.place_name_es }</p>
                `)

            const newMarker = new Marker()
                .setPopup( popup )
                .setLngLat( [ lng, lat ] )
                .addTo( mapState.map! );
            
            newMarkers.push( newMarker );
        }

        //Todo: Limpiar polylines

        dispatch({ type: 'setMarkers', payload: newMarkers })

    }, [ places ]);
    

    const setMap = useCallback(( map: Map) => {

        const myLocationPopup = new Popup()
            .setHTML(`
                <h4>Aqui estoy</h4>
                <p>En algun lugar del mundo</p>
            `);

        new Marker()
        .setLngLat( map.getCenter() )
        .setPopup( myLocationPopup )
        .addTo( map )

        dispatch({ type:'setMap', payload: map })

    }, [ dispatch]);
    

    const getRouteBetweenPoints = async( start: [ number, number ], end: [ number, number ]) => {

        const resp = await directionsApi.get<DirectionsResponse>(`/${ start.join(',')}; ${ end.join(',')}`);
        const { distance, duration, geometry } = resp.data.routes[0]
        const { coordinates: coords } = geometry;

        let kms = distance / 1000;
            kms = Math.round( kms * 100 );
            kms /= 100;

        const minutes = Math.floor( duration / 60 );

        console.log( 'KM:' + kms, 'Minutos:'+ minutes );

        const bounds = new LngLatBounds(
            start,
            start
        )

        for (const coord of coords ) {
            const newCoord: [ number, number ] = [ coord[0], coord[1] ];
            bounds.extend( newCoord )
        }
    
        mapState.map?.fitBounds( bounds, {
            padding: 200
        });

        //Poluline
        const sourceData: AnySourceData = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coords
                        }
                    }
                ]
            }
        }


        // Remover polyuline si existe
        if( mapState.map?.getLayer('RouteString')){
            mapState.map.removeLayer('RouteString');
            mapState.map.removeSource('RouteString');
        }

        mapState.map?.addSource('RouteString', sourceData );

        mapState.map?.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': 'black',
                'line-width': 3
            }
        })
        
    }

    return (
        <MapContext.Provider  value={{
            ...mapState,

            //methods
            setMap,
            getRouteBetweenPoints,
        }}>
            { children }
        </MapContext.Provider>
    )
};
