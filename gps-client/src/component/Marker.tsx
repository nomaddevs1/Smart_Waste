import { Button } from "@chakra-ui/react";
import { useMarker } from "../hooks/useMarker";

function AddMarker () {
  const { createMarker, markers, updateMarker } = useMarker();

  const addMarker = () => {
    createMarker({ lat: 33.2106633, lng: -97.1498416 }, "ABC")
    createMarker({ lat: 33.252807, lng: -97.152697 }, "XYZ")

    console.log(markers);
  }

  const update = () => {
    updateMarker(1);
  }

  return (
    <>
      <Button pos="absolute" left="4" bottom="2%" width="150px" onClick={addMarker}>Create Marker</Button>
      <Button pos="absolute" left="4" bottom="8%" width="150px" onClick={update}>Update Marker</Button>
    </>
  )
}

export default AddMarker;