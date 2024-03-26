import { Box, Button } from "@chakra-ui/react";
import { useMapContext } from "../context/MapContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useMarker } from "../hooks/useMarker";

function Map() {
  const { map, mapRef } = useMapContext();
  const {userLocation} = useGeolocation();
  const { createMarker } = useMarker();

  if (map && userLocation){
    map.panTo(userLocation);
  }

  const addMarker = () => {
    createMarker({ lat: 33.2106633, lng: -97.1498416 }, "ABC", "full")
    createMarker({ lat: 33.252807, lng: -97.152697 }, "XYZ", "empty")
  }

  return (
    <>
      <Button pos="absolute" left="4" zIndex="1000" bottom="2%" width="150px" onClick={addMarker}>Create Marker</Button>
      <Box width="100%" height="100%" ref={mapRef} id="map"/>
    </>
  );
}

export default Map;