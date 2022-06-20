import { useEffect, useReducer } from "react";
import { getUserLocation } from "../../helpers";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./placesReducer";
import { searchApi } from "../../apis";
import { Feature, PlacesResponse } from "../../interfaces/places";

export interface PlacesState {
    isLoading: boolean;
    userLocation?: [ number, number ],
    isLoadingPlaces: Boolean;
    places: Feature[]
}


const Initial_State: PlacesState = {
    isLoading: true,
    userLocation: undefined,
    isLoadingPlaces: false,
    places: [],
}


interface Props {
    children: JSX.Element | JSX.Element[]
} 


export const PlacesProvider = ({ children }: Props) => {

    const [ state, dispatch ] = useReducer( placesReducer, Initial_State );

    useEffect(() => {
        getUserLocation()
            .then( lngLat => dispatch({ type: 'setUserLocation', payload: lngLat }))

    }, []);

    const searchPlacesByQuery = async( query: string ): Promise<Feature[]> => {
        if( query.length === 0 ) {
            dispatch({ type: 'setPlaces', payload: []});
            return [];
        } ;
        if( !state.userLocation ) throw new Error('No hay ubicacion del usuario')

        dispatch({ type: 'setLoadingPlaces' });

        const resp = await searchApi.get<PlacesResponse>(`/${ query }.json`, {
            params: {
                proximity: state.userLocation.join(',')
            }
        })

        dispatch({ type: 'setPlaces', payload: resp.data.features });
        return resp.data.features
        
    }
    

    return (
        <PlacesContext.Provider value={{
            ...state, 

            //methods
            searchPlacesByQuery,
            
        }}>
            { children }
        </PlacesContext.Provider>
    )
};
