
import React, { createContext, useContext, useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import FirestoreService from "../db/db";
import { useAuth } from "./UserAuthContext";
import { useGeocoding } from "../hooks/useGeocoding";

interface BoardContextProps {
  boards: DocumentData[] | [];
}

const BoardContext = createContext<BoardContextProps | null>(null);

export const BoardProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, isLoading } = useAuth()!;
  const [boards, setBoards] = useState<DocumentData[] | []>([]);
  const { getAddress } = useGeocoding(); 

  useEffect(() => {
    if (isLoading) {
      return;
    }else{
      if(user && !isLoading){
      setBoards([])
      let unsubscribeFn = () => {};
      const setupBoardListener = async () => {
        try {
          unsubscribeFn = await FirestoreService.listenForBoardUpdates(user.uid, (data) => {
            data.forEach((item) => {
              if(item.location !== ""){
              getAddress(item.serialNumber, item.lat, item.lng);
              }
            })
            setBoards(data);
          });
        } catch (err) { 
          console.error("Failed to set up board listener", err);
        }
      };
      setupBoardListener();

      return () => unsubscribeFn();
    } else {
            const fetchBoards = async () => {
        try {
          const boardsData = await FirestoreService.fetchAllBoards();
          setBoards(boardsData);
        } catch (err) {
          console.error("Failed to fetch boards", err);
        }
      };
      fetchBoards();
    }
    }
  }, [user, isLoading]);

  return <BoardContext.Provider value={{ boards }}>{children}</BoardContext.Provider>;
};

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
};
