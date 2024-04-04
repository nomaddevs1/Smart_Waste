import { db } from "../firebase/adminConfig"; // Your initialized Firebase Admin

export const updateBoardLocation = async (
  serialNumber: string,
  lat: string,
  lng: string
) => {
  try {
    const boardDocRef = db.collection("boards").doc(serialNumber);
    if (parseInt(lat) !== 0 && parseInt(lng) !== 0) {
      await boardDocRef.update({
        lat: lat,
        lng: lng,
        status: "full",
      });
    } else {
      await boardDocRef.update({
        status: "full",
      });
    }
  } catch (e) {
    console.log(e);
  }
};
