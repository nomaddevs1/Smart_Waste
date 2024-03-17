import { Button } from "@chakra-ui/react";
import { useMarker } from "../hooks/useMarker";

function AddMarker () {
  const { createMarker } = useMarker();

  const addMarker = () => {
    createMarker({ lat: 33.2106633, lng: -97.1498416 })
  }

  return (
    <>
      <Button pos="absolute" left="4" bottom="4" width="100px" onClick={addMarker}>Create Marker</Button>
    </>
  )
}

export default AddMarker;