import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useMapContext } from "../context/MapContext";
import { useGeolocation } from "../hooks/useGeolocation";

function Map() {
  const { map, mapRef } = useMapContext();
  const {userLocation} = useGeolocation();

  useEffect(() => {
    window.google.maps.importLibrary('marker');
  }, []);

  if (map && userLocation){
    map.panTo(userLocation);
  }

  return (
    <Box width="100%" height="100%" ref={mapRef} id="map"/>
  );
}

export default Map;