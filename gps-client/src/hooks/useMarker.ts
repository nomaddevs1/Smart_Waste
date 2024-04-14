import { useMapContext } from '../context/MapContext';
import { useDirections } from './useDirections';
import { useGeolocation } from './useGeolocation';
import bin_empty from '../assets/bin_empty.svg';
import bin_full from '../assets/bin_full.svg';
import { useAuth } from "../context/UserAuthContext";
import FirestoreService from "../db/db";
import { useState } from 'react';
import "../styles/marker.css";

interface useMarkerProps {
  createMarker: (
    position: google.maps.LatLngLiteral, 
    boardSerial: string, 
    binStatus: string, 
    boardName: string,
    boardLocation: string,
  ) => void;
  originStr: string;
  destinationStr: string;
}

export const useMarker = (role: string): useMarkerProps => {
  const { map } = useMapContext();
  const { userLocation } = useGeolocation();
  const { calculateRoute } = useDirections();
  const { isAuthenticated} = useAuth()!;
  const [originStr, setOriginStr] = useState<string>("");
  const [destinationStr, setDestinationStr] = useState<string>("");

  const toggleHighlight = (marker: google.maps.marker.AdvancedMarkerElement) => {
    if(marker.content){
      const markerContent = marker.content as HTMLElement;
      if (markerContent.classList.contains("highlight")){
        markerContent.classList.remove("highlight");
        marker.zIndex = null;
      } else {
        markerContent.classList.add("highlight");
        marker.zIndex = 1;
      }
    }
  }

  const buildContent = (boardSerial: string, markerPosition: google.maps.LatLngLiteral, binStatus: string, boardName: string, boardLocation: string) => {
    const content = document.createElement('div');
    content.classList.add(`mapMarker`)
    
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

    binGlyph.element.classList.add(`markerGlyph`);
    content.appendChild(binGlyph.element);
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
        setOriginStr(`${userLocation.lat},${userLocation.lng}`);
        setDestinationStr(`${markerPosition.lat},${markerPosition.lng}`);
      } else {
        alert ("User location not found, please enable location services");
      }
    }

    const popup = document.createElement("div");
    popup.classList.add(`markerPopup`)

    const popupContainer = document.createElement("div");
    popupContainer.classList.add('popupContainer');

    const boardIdentifier = document.createElement('h3');
    boardIdentifier.textContent = `${boardName ? boardName : boardSerial}`;
    popupContainer.append(boardIdentifier);

    const boardAddress = document.createElement('p');
    if(boardLocation){
    boardAddress.textContent = `${boardLocation.split(',')[0]}`;
    popupContainer.append(boardAddress)
    }

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer");

    const routeButton = document.createElement('button');
    routeButton.textContent = 'Get Route';
    routeButton.onclick = () => {getRoute()};
    buttonContainer.append(routeButton);

    if (isAuthenticated && binStatus === 'full' && role === "collector") {
      const resetStatus = document.createElement('button');
      resetStatus.textContent = "Reset Status";
      resetStatus.onclick = () => {updateStatus()};
      buttonContainer.appendChild(resetStatus);
    }

    popupContainer.appendChild(buttonContainer);
    popup.appendChild(popupContainer);
    content.appendChild(popup);

    return content;
  }

  const createMarker = (markerPosition: google.maps.LatLngLiteral, boardSerial: string, binStatus: string, boardName: string, boardLocation: string) => {
    if (map){
      const newMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: markerPosition, 
        content: buildContent(boardSerial, markerPosition, binStatus, boardName, boardLocation),
        title: `Board: ${boardSerial}`,
      })

      if (newMarker){
        newMarker.addListener("click", () => {
          toggleHighlight(newMarker);
        })
      }
    }
  }

  return { createMarker, originStr, destinationStr }
}