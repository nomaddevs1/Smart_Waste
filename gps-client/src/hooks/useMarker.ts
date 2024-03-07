import { useMapContext } from '../context/MapContext';
import { useDirections } from './useDirections';

interface useMarkerProps {
  createMarker: (position: google.maps.LatLngLiteral) => void;
}

export const useMarker = (): useMarkerProps => {
  const { map } = useMapContext();
  const { calculateRoute } = useDirections();

  const contentString =
  '<div id="content">' +
  '<h3 id="firstHeading" class="firstHeading">SN: 123456789</h3>' +
  `<button id="routeButton">Get Route</button` +
  "</div>";

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: "marker-info",
  })

  const createMarker = (position: google.maps.LatLngLiteral) => {
    if (map){
      const newMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position, 
      })

      if (newMarker){
        newMarker.addListener("click", () => {
          infowindow.open({
              anchor: newMarker,
              // Reformat as chakra modal that passes coords for route
              map,
          })

          const routeButton = document.getElementById("routeButton");
          if (routeButton) {
            routeButton.addEventListener("click", () => {
              calculateRoute();
            });
          }
        })
      }
    }
  }

  return { createMarker }
}