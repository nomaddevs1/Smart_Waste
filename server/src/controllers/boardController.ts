import { Request, Response } from 'express';
import  {updateBoardLocation}  from "../services/boardServices"; // Assuming you create a service for database operations

export const updateBoardLocationController = async (req: Request, res: Response) => {
  const { lat, lng, serialNumber } = req.body;
  console.log(req.body)
  try {
    await updateBoardLocation(serialNumber, lat, lng);
    res.status(200).send({ message: "Board location updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to update board location", error });
  }
};
