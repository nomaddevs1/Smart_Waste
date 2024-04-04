import { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';

interface MapContextProps {
  mapRef: React.RefObject<HTMLDivElement>;
  directionsRef: React.RefObject<HTMLDivElement>;
  map: google.maps.Map | undefined;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
}

const MapContext = createContext<MapContextProps | null>(null);

export const MapProvider = ({ children }: any) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const directionsRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>()
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = useMemo(() => new google.maps.DirectionsRenderer({suppressMarkers: true}), []);
  
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

  useEffect(() => {
    if (map && directionsRef.current){
      directionsRenderer.setMap(map);
      directionsRenderer.setPanel(directionsRef.current);
    }
  })

  return (
    <MapContext.Provider value={{ mapRef, directionsRef, map, directionsService, directionsRenderer }}>
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