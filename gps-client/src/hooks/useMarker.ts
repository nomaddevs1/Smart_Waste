import { useMapContext } from '../context/MapContext';
import { useDirections } from './useDirections';
import bin_empty from '../assets/bin_empty.svg';
import bin_full from '../assets/bin_full.svg';

interface useMarkerProps {
  createMarker: (position: google.maps.LatLngLiteral) => void;
  updateMarker: () => void;
}

export const useMarker = (): useMarkerProps => {
  const { map } = useMapContext();
  const { calculateRoute } = useDirections();

  const createMarker = (markerPosition: google.maps.LatLngLiteral) => {
    const binEmpty = document.createElement('img');
    binEmpty.src = bin_empty;
    binEmpty.style.width = '20px';
    binEmpty.style.height = '20px';

    const binEmptyGlyph = new google.maps.marker.PinElement({
      glyph: binEmpty,
      scale: 1.2,
      background: '#37a132',
      borderColor: '#1d571a',
    });

    const getRoute = () => {
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
      }
    }

    const infowindow = new google.maps.InfoWindow();
    const info = document.createElement('button');
    info.textContent = 'Get Route';
    info.onclick = () => {getRoute()};

    if (map){
      const newMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: markerPosition, 
        content: binEmptyGlyph.element,
      })

      if (newMarker){
        newMarker.addListener("click", () => {
          infowindow.setContent(info);
          infowindow.open({
            anchor: newMarker,
            map,
          })
        })
      }
    }
  }

  const updateMarker = () => {
    const binFull = document.createElement('img');
    binFull.src = bin_full;
    binFull.style.width = '20px';
    binFull.style.height = '20px';

    const binFullGlyph = new google.maps.marker.PinElement({
      glyph: binFull,
      scale: 1.2,
      background: '#ba423c',
      borderColor: '#591e1b',
    });
    
    // marker.setContent(binFullGlyph.element);
  }

  return { createMarker, updateMarker }
}