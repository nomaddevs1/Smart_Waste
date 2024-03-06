import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useMapContext } from "../context/MapContext";

function Map() {
  const { map, mapRef } = useMapContext();

  useEffect(() => {
    window.google.maps.importLibrary('marker');
  }, []);

  if (navigator.geolocation && map) {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.panTo(pos);
      }, () => {
        console.log("Geolocation service failed.");
      }
    )
  } else {
    //console.log("Browser does not support Geolocation.");
  }

  return (
    <Box width="100%" height="100%" ref={mapRef} id="map"/>
  );
}

export default Map;