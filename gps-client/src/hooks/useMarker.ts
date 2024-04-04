import { useMapContext } from '../context/MapContext';
import { useDirections } from './useDirections';
import { useGeolocation } from './useGeolocation';
import bin_empty from '../assets/bin_empty.svg';
import bin_full from '../assets/bin_full.svg';
import { useAuth } from "../context/UserAuthContext";
import FirestoreService from "../db/db";

interface useMarkerProps {
  createMarker: (position: google.maps.LatLngLiteral, boardSerial: string, binStatus: string) => void;
  markers: Array<google.maps.marker.AdvancedMarkerElement>
}

export const useMarker = (): useMarkerProps => {
  const { map } = useMapContext();
  const { userLocation } = useGeolocation();
  const { calculateRoute } = useDirections();
  const { isAuthenticated } = useAuth()!;
  let markers: Array<google.maps.marker.AdvancedMarkerElement> = [];

  const createMarker = (markerPosition: google.maps.LatLngLiteral, boardSerial: string, binStatus: string) => {
    const binSvg = document.createElement('img');
    binSvg.src = binStatus === "full" ? bin_full : bin_empty ;
    binSvg.style.width = '20px';
    binSvg.style.height = '20px';

    const binGlyph = new google.maps.marker.PinElement({
      glyph: binSvg,
      scale: 1.2,
      background: binStatus === "full" ?  '#C53030' : '#2F855A',
      borderColor: binStatus === "full" ? '#9B2C2C': '#276749',
    });

    const updateStatus = async () => {
      try {
        await FirestoreService.setBoardStatus(boardSerial);
      } catch (error) {
        console.error("Failed to update board status", error);
      }
    }

    const getRoute = () => {
      if (userLocation){
        calculateRoute(userLocation, markerPosition);
      } else {
        alert ("User location not found, please enable location services");
      }
    }

    const infowindow = new google.maps.InfoWindow();
    const info = document.createElement('div');
    const infoSN = document.createElement('p');
    infoSN.textContent = `SN: ${boardSerial}`;

    const routeButton = document.createElement('button');
    routeButton.textContent = 'Get Route';
    routeButton.onclick = () => {getRoute()};

    info.appendChild(infoSN);
    info.appendChild(routeButton);

    if (isAuthenticated && binStatus === 'full') {
      const resetStatus = document.createElement('button');
      resetStatus.textContent = "Reset Status";
      resetStatus.onclick = () => {updateStatus()};
      info.appendChild(resetStatus);
    }

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

  return { createMarker, markers }
}