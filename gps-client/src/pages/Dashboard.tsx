import React, { useEffect, useState } from "react";
import {
  Flex,
  IconButton,
  useDisclosure
} from "@chakra-ui/react";
import { WifiMedium } from "@phosphor-icons/react";
import WifiSetupModal from "../component/WifiSetupModal";
import FirestoreService from "../db/db";
import { useAuth } from "../context/UserAuthContext";
import { DocumentData } from "firebase/firestore";
import Cards from "../component/Card";

const Dashboard = () => {
  const [selectedBoard] = useState<string | null>(null);
  const [boards, setBoard] = useState<[] | DocumentData[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {user} = useAuth()!


useEffect(() => {
  // Ensure user is defined before attempting to fetch data
  if (user) {
    const fetchBoards = async () => {
      try {
        const data = await FirestoreService.getAllBoardsForOrg(user.uid);
        const flattenedData = data.flat();
        setBoard(flattenedData);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }
}, [user, boards])

  const openModal = () => {
    onOpen();
  };

  return (
    <Flex
      // flexDirection="column"
      width="100wh"
      marginTop={"100px"}
      
      // For the absolute positioning of the Add button
    >
      <Cards boards={boards}/>
      <WifiSetupModal
        isOpen={isOpen}
        onClose={onClose}
        boardId={selectedBoard!}
      />

      <IconButton
        icon={<WifiMedium size={32} color="#366fba" />}
        colorScheme="teal"
        borderRadius="full"
        position="absolute"
        bottom="25"
        right="5"
        aria-label="Add Button"
        onClick={() => openModal()}
      />
    </Flex>
  );
};

export default Dashboard;
