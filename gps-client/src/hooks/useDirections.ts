import { useMapContext } from '../context/MapContext';

interface useDirectionsProps {
  calculateRoute: () => void;
}

export const useDirections = (): useDirectionsProps => {
  const { directionsRenderer, directionsService } = useMapContext();

  const calculateRoute = () => {
    console.log("calculating route...");
    /*
    directionsService
      .route({
        origin: "33.086439, -97.111816",
        destination: "33.2106633, -97.1498416",
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        console.log(response);
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert("Directions request failed"));
    */
  }

  return {calculateRoute}
}