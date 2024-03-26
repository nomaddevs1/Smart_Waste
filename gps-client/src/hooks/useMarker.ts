import { useMapContext } from '../context/MapContext';
import { useDirections } from './useDirections';
import { useGeolocation } from './useGeolocation';
import bin_empty from '../assets/bin_empty.svg';
import bin_full from '../assets/bin_full.svg';

interface useMarkerProps {
  createMarker: (position: google.maps.LatLngLiteral, boardSerial: string, binStatus: string) => void;
  markers: Array<google.maps.marker.AdvancedMarkerElement>
}

export const useMarker = (): useMarkerProps => {
  const { map } = useMapContext();
  const { userLocation } = useGeolocation();
  const { calculateRoute } = useDirections();
  let markers: Array<google.maps.marker.AdvancedMarkerElement> = [];

  const createMarker = (markerPosition: google.maps.LatLngLiteral, boardSerial: string, binStatus: string) => {
    const binSvg = document.createElement('img');
    binSvg.src = binStatus === "full" ? bin_empty : bin_full;
    binSvg.style.width = '20px';
    binSvg.style.height = '20px';

    const binGlyph = new google.maps.marker.PinElement({
      glyph: binSvg,
      scale: 1.2,
      background: binStatus === "full" ? '#37a132' : '#ba423c',
      borderColor: binStatus === "full" ? '#1d571a': '#591e1b',
    });

    const getRoute = () => {
      if (userLocation){
        calculateRoute(userLocation, markerPosition);
      } else {
        alert ("User location not found, please enable location services");
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
        content: binGlyph.element,
        title: `Board: ${boardSerial}`,
      })

      if (newMarker){
        newMarker.addListener("click", () => {
          infowindow.setContent(info);
          infowindow.open({
            anchor: newMarker,
            map,
          })
        })
        markers.push(newMarker);
      }
    }
  }

  /*
  const updateMarker = (markerIndex: number) => {
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
    
    markers[markerIndex].content = binFullGlyph.element;
  }
  */

  return { createMarker, markers }
}