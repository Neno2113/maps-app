import { useContext, useState } from "react";
import { start } from "repl";
// import { LoadingPlaces } from ".";
import { MapContext, PlacesContext } from "../context";
import { Feature } from "../interfaces/places";




export const SearchResult = () => {

    const { places, userLocation } = useContext( PlacesContext );
    const { map, getRouteBetweenPoints } = useContext( MapContext );
    const [activeId, setActiveId] = useState('');

    // if( isLoadingPlaces ){
    //     return <LoadingPlaces />
    // }

    const onPlaceClick = ( place: Feature ) => {
        const [ lng, lat ] = place.center;
        setActiveId( place.id );
        map?.flyTo({
            zoom: 14,
            center: [ lng, lat]
        })

    }

    if( places.length === 0) return <></>


    const getRoute = ( place: Feature ) => {
        if( !userLocation ) return;
        const [ lng, lat ] = place.center;

        getRouteBetweenPoints( userLocation, [ lng, lat ]);
    }


    return (
        <ul className="list-group my-3"> 

            {
                places.map( place => (
                    <li 
                        className={`list-group list-group-item-action pointer my-2 ${ (activeId === place.id ? 'active' : '')}`}
                        key={ place.id }
                        onClick={ () =>  onPlaceClick( place ) }
                    >

                        <h6>{ place.text_es }</h6>
                        <p 
                           
                            style={{
                                fontSize: '12px'
                            }}
                        >
                            { place.place_name }
                        </p>
                        <button 
                            className={`btn btn-sm ${ activeId === place.id ? 'btn-outline-light' : 'btn-outline-primary' }  `}
                            onClick={ () =>  getRoute( place ) }
                        >
                            Direcciones
                        </button>
    
                    </li>
                ))
            }
          
        </ul>
    )
};
