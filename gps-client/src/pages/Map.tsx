import { Box } from "@chakra-ui/react";
import { useMapContext } from "../context/MapContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useBoardContext } from "../context/BoardContext";
import { useMarker } from "../hooks/useMarker";
import { useEffect } from "react";


function Map() {
  const { map, mapRef } = useMapContext();
  const { userLocation } = useGeolocation();
  const { boards } = useBoardContext()!;
  const { createMarker } = useMarker();
  
  if (map && userLocation) {
    map.panTo(userLocation);
  }
  useEffect(() => {
    boards.forEach((board) => {
      if (board.lat && board.lng) {
        createMarker(
          { lat: parseFloat(board.lat), lng: parseFloat(board.lng) },
          board.serialNumber,
          board.status
        );
      }
    });
    
  });

  return (
    <>
      {/* <Button pos="absolute" left="4" zIndex="1000" bottom="2%" width="150px" onClick={addMarker}>Create Marker</Button> */}
      <Box width="100%" height="100%" ref={mapRef} id="map" />
    </>
  );
}

export default Map;
