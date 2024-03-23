import { useEffect, useState } from "react";
import {
  Flex,
  IconButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { WifiMedium } from "@phosphor-icons/react";
import WifiSetupModal from "../component/WifiSetupModal";
import FirestoreService from "../db/db";
import { useAuth } from "../context/UserAuthContext";
import { DocumentData } from "firebase/firestore";
import Cards from "../component/Card";
import AllBoards from "../component/AllBoards";

const Dashboard = () => {
  const [selectedBoard] = useState<string | null>(null);
  const [boards, setBoard] = useState<[] | DocumentData[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {user} = useAuth()!
  const [viewAllBoards, setViewAllBoards] = useState(false);

useEffect(() => {
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
}, [user])
  
  useEffect(() => {
    FirestoreService.listenForBoardUpdates(user!.uid, (data) => {
      setBoard(data)
    })
  }, [])

  const openModal = () => {
    onOpen();
  };

  const toggleAllBoards = () => {
    setViewAllBoards(!viewAllBoards);
  }

  return (
    <Flex
      width="100wh"
      marginTop={"100px"}
      overflowY={"auto"}
    >
      {viewAllBoards ? <AllBoards /> : <Cards boards={boards}/>}

      <WifiSetupModal
        isOpen={isOpen}
        onClose={onClose}
        boardId={selectedBoard!}
      />

      <IconButton
        icon={<WifiMedium size={32} color="white" />}
        colorScheme="teal"
        borderRadius="full"
        position="absolute"
        bottom="25"
        right="5"
        aria-label="Add Button"
        onClick={() => openModal()}
      />
      <Button pos="absolute" top="90px" right="5" variant="link" onClick={toggleAllBoards}>
        {viewAllBoards ? "Return to Dashboard" : "Show All Boards"}
      </Button>
    </Flex>
  );
};

export default Dashboard;
