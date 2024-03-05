import React, { useState } from "react";
import {
  Flex,
  Box,
  IconButton,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { WifiMedium } from "@phosphor-icons/react";
import WifiSetupModal from "../component/WifiSetupModal";

// Assuming you have a list of boards, here's a mocked example
const boards = [
  { id: 1, name: "Board 1" },
  { id: 2, name: "Board 2" },
  // Add more boards as needed
];

const Dashboard = () => {
  const [selectedBoard] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getBoards = {}
  const openModal = () => {
    onOpen();
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      marginTop={"100px"}
      // backgroundColor="gray.200"
      position="relative" // For the absolute positioning of the Add button
    >
      <Wrap spacing="30px" justify="center">
        {boards.map((board) => (
          <WrapItem key={board.id}>
            <Box
              p="10"
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="lg"
              bg="white"
              alignItems={"center"}
            >
              {board.name}
            </Box>
          </WrapItem>
        ))}
      </Wrap>
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
        bottom="4"
        right="4"
        aria-label="Add Button"
        onClick={() => openModal()}
      />
    </Flex>
  );
};

export default Dashboard;
