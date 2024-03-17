import { useMapContext } from '../context/MapContext';
import { useDirections } from './useDirections';

interface useMarkerProps {
  createMarker: (position: google.maps.LatLngLiteral) => void;
  updateMarker: () => void;
}

export const useMarker = (): useMarkerProps => {
  const { map } = useMapContext();
  const { calculateRoute } = useDirections();

  const createMarker = (markerPosition: google.maps.LatLngLiteral) => {
    if (map){
      const newMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: markerPosition, 
      })

      if (newMarker){
        newMarker.addListener("click", () => {
          if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
              (position: GeolocationPosition) => {
                const userPosition = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                calculateRoute(userPosition, markerPosition);
              }, () => {
                console.log("Geolocation service failed.");
              }
            )
          } else {
            //console.log("Browser does not support Geolocation.");
          }
        })
      }
    }
  }

  const updateMarker = () => {
    // handle marker icon update
  }

  return { createMarker, updateMarker }
}