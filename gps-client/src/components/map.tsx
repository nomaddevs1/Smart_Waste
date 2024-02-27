import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

function Map({
    center,
    zoom,
  }: {
    center: google.maps.LatLngLiteral;
    zoom: number;
  }) {

    const ref = useRef<any>(null);
  
    
    useEffect(() => {
        if (ref) {
            new window.google.maps.Map(ref.current, {
                center,
                zoom,
            });
        }
    });
  
    return <Box width="100%" height="100%" ref={ref} id="map" />;
}

export default Map;