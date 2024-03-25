import { useMapContext } from '../context/MapContext';

interface useDirectionsProps {
  calculateRoute: (origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) => void;
}

export const useDirections = (): useDirectionsProps => {
  const { directionsRenderer, directionsService } = useMapContext();

  const calculateRoute = (origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) => {
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