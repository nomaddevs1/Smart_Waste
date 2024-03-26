import { useEffect, useState } from "react";
import {
  Flex,
  IconButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { WifiMedium } from "@phosphor-icons/react";
import WifiSetupModal from "../component/WifiSetupModal";

// import { useAuth } from "../context/UserAuthContext";

import Cards from "../component/Card";
import AllBoards from "../component/AllBoards";
import { useBoardContext } from "../context/BoardContext";

const Dashboard = () => {
  const [selectedBoard] = useState<string | null>(null);
  const {boards} = useBoardContext()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewAllBoards, setViewAllBoards] = useState(false);

  const openModal = () => {
    onOpen();
  };

  const toggleAllBoards = () => {
    setViewAllBoards(!viewAllBoards);
  }
  useEffect(() => {
    console.log(boards)
  }, [boards])
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
