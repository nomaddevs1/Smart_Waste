import { db } from '../firebase/adminConfig'; // Your initialized Firebase Admin

export const updateBoardLocation = async (serialNumber: string, lat: string, lng: string) => {
  try{
  const boardDocRef = db.collection('boards').doc(serialNumber);
  await boardDocRef.update({
    lat: lat,
    lng: lng,
    status: "full"
  });
}catch (e) {
  console.log(e);
}

};
