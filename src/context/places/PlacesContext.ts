import { createContext } from "react";
import { Feature } from "../../interfaces/places";



export interface PlacesContextProps {
    isLoading: boolean;
    userLocation?: [ number, number ];
    isLoadingPlaces: Boolean;
    places: Feature[];

    searchPlacesByQuery: ( query: string ) => Promise<Feature[]>;
}


export const PlacesContext =  createContext<PlacesContextProps>({} as PlacesContextProps );