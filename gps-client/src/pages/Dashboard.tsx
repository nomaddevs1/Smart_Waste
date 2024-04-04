import {  useState } from "react";
import {
  Flex,
  IconButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { WifiMedium } from "@phosphor-icons/react";
import WifiSetupModal from "../component/WifiSetupModal";
import Cards from "../component/Card";
import AllBoards from "../component/AllBoards";

const Dashboard = () => {
  const [selectedBoard] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewAllBoards, setViewAllBoards] = useState(false);

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
      {viewAllBoards ? <AllBoards /> : <Cards/>}

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
