import { useMapContext } from '../context/MapContext';


interface useMarkerProps {
  createMarker: (position: google.maps.LatLngLiteral) => void;
}

const contentString =
'<div id="content">' +
'<h3 id="firstHeading" class="firstHeading">SN: 123456789</h3>' +
'<button>Get Route</button>' +
"</div>";

export const useMarker = (): useMarkerProps => {
  const { map } = useMapContext();

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
              map,
          })
        })
      }
    }
  }

  return { createMarker }
}