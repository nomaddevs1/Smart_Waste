import { useMapContext } from '../context/MapContext';
import { useGeolocation } from './useGeolocation';
import user_circle from '../assets/user_circle.svg';

interface useDirectionsProps {
  calculateRoute: (origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) => void;
}

export const useDirections = (): useDirectionsProps => {
  const { directionsRenderer, directionsService, map, directionsRef } = useMapContext();
  const { userLocation } = useGeolocation();

  const calculateRoute = (origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) => {
    const userSvg = document.createElement('img');
    userSvg.src = user_circle;
    userSvg.style.width = '20px';
    userSvg.style.height = '20px';

    const userGlyph = new google.maps.marker.PinElement({
      glyph: userSvg,
      scale: 1.2,
      background: "teal.300",
      borderColor: "teal",
    });

    new google.maps.marker.AdvancedMarkerElement({
      map,
      content: userGlyph.element,
      position: userLocation,
      title: "User Current Location"
    });

    if (directionsRef.current) {
      directionsRef.current.style.padding=("80px 1rem 1rem 1rem");
    }

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert("Directions request failed"));
  }

  return {calculateRoute}
}