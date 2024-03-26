import React, { createContext, useContext, useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import FirestoreService from "../db/db";
import { useAuth } from "./UserAuthContext";

interface BoardContextProps {
    boards: DocumentData[] | [];
    
}

const BoardContext = createContext<BoardContextProps | null>(null);

export const BoardProvider: React.FC<{children: React.ReactNode;}> = ({ children }) => {
  const { user } = useAuth()!;
  const [boards, setBoards] = useState<DocumentData[] | []>([]);

  useEffect(() => {
    let unsubscribeFn = () => {};

    if (user) {
      const setupBoardListener = async () => {
        unsubscribeFn = await FirestoreService.listenForBoardUpdates(user.uid, (data) => {
          setBoards(data);
        });
      };

      setupBoardListener();
    }

    // Cleanup function
    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [user]);

  return <BoardContext.Provider value={{ boards }}>{children}</BoardContext.Provider>;
};

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used within a BoardContext.Provider");
  }
  return context;
};
