import { useState, useEffect } from "react";

interface useGeolocationProps {
  getUserLocation: () => void;
  userLocation: google.maps.LatLngLiteral | undefined;
}

export const useGeolocation = (): useGeolocationProps => {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>();

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPosition);
        }, () => {
          console.error("Geolocation service failed.");
        }
      )
    } else {
      console.error("Browser does not support Geolocation.");
    }
  }

  useEffect(() => {
    getUserLocation();
  }, [])

  return {getUserLocation, userLocation}
}