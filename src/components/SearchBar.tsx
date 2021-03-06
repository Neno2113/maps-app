import { ChangeEvent, useContext, useRef } from "react";
import { SearchResult } from ".";
import { PlacesContext } from "../context";

export const SearchBar = () => {

    const { searchPlacesByQuery } = useContext( PlacesContext );

    const debounceRef = useRef<NodeJS.Timeout>(  );

    const onQueryChange = ( e: ChangeEvent<HTMLInputElement> ) => {
        if( debounceRef.current ){
            clearTimeout( debounceRef.current );
        }


        debounceRef.current = setTimeout( () => {
            // Ejecutar consultad
            searchPlacesByQuery( e.target.value );
            
        }, 350 )
    }

    return (
        <div className="search-container">
            <input 
                type="text" 
                className="form-control"
                placeholder="Buscar Lugar..."
                onChange={ onQueryChange }
            />


            <SearchResult />


        </div>
    );
};
