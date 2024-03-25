import { createContext, useContext, useState, useEffect, useRef } from 'react';

interface MapContextProps {
  mapRef: React.RefObject<HTMLDivElement>;
  map: google.maps.Map | undefined;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
}

const MapContext = createContext<MapContextProps | null>(null);

export const MapProvider = ({ children }: any) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>()
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
  
  useEffect(() => {
    if (mapRef.current && map === undefined) {
      setMap(
        new window.google.maps.Map(mapRef.current, {
          mapId: '6e5a2f90fad8af6e',
          center: { lat: 33.2106633, lng: -97.1498416 },
          zoom: 14,
          disableDefaultUI: true,
          clickableIcons: false,
        })
      )
    }
  }, [map]);

  if (map){
    directionsRenderer.setMap(map);
  }

  return (
    <MapContext.Provider value={{ mapRef, map, directionsService, directionsRenderer }}>
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
      throw new Error(
          'useMapContext must be used within MapContext.Provider'
      );
  }
  return context;
};