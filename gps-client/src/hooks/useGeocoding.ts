import axios from "axios";
import FirestoreService from "../db/db";

interface useGeocodingProps {
  getAddress: (boardSerial: string, lat: string, lng: string) => void;
}

export const useGeocoding = (): useGeocodingProps => {
  const mapKey = `${process.env.REACT_APP_MAPS_API_KEY}`;

  const getAddress = async (boardSerial: string, lat: string, lng: string) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapKey}`
      );
      const data = res.data;

      if (data.results && data.results.length > 0){
        const updateLocation = async () => {
          try {
            await FirestoreService.setBoardLocation(boardSerial, data.results[0].formatted_address);
          } catch (error) {
            console.error("Failed to update board status", error);
          }
        }
        updateLocation();
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      throw new Error('Error fetching address');
    }
  }

  return {getAddress}
}