import { Box, Flex } from "@chakra-ui/react";
import { useMapContext } from "../context/MapContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useBoardContext } from "../context/BoardContext";
import { useMarker } from "../hooks/useMarker";
import { useEffect } from "react";

function Map() {
  const { map, mapRef, directionsRef } = useMapContext();
  const {userLocation} = useGeolocation();
  const { boards } = useBoardContext()!
  const { createMarker } = useMarker();

  if (map && userLocation){
    map.panTo(userLocation);
  }
  
  useEffect(() => {
    boards.forEach(board => {
      if(board.lat && board.lng){
       createMarker({ lat:parseFloat(board.lat), lng: parseFloat(board.lng)}, board.serialNumber, board.status)
      }
      })
  })


  return (
    <Flex height="100%">
      {/* <Button pos="absolute" left="4" zIndex="1000" bottom="2%" width="150px" onClick={addMarker}>Create Marker</Button> */}
      <Box width="100%" height="100%" ref={mapRef} id="map"/>
      <Box
        ref={directionsRef}
        p="0"
        flexBasis="15rem"
        flexGrow="1"
        maxWidth="30rem"
        height="100%"
        overflow="auto"
        boxSizing="border-box"
        flex="0 1 auto"
      />
    </Flex>
  );
}

export default Map;