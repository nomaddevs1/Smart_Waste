import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Box,
  Input,
} from "@chakra-ui/react";
import { useBoardContext } from "../context/BoardContext";
import { PencilSimpleLine } from "@phosphor-icons/react";
import FirestoreService from "../db/db";
import React, { useState } from "react";

const Cards = () => { 
  const {boards} = useBoardContext();
  const [changingName, setChangingName] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const updateName = async (boardSerial: string, newName: string) => {
    try {
      await FirestoreService.setBoardName(boardSerial, newName);
      setChangingName(null);
    } catch (error) {
      console.error("Failed to update board name", error);
    }
  }

  const toggleNameChange = (boardSerial: string) => {
    setChangingName(boardSerial);
  }

  const handleNewName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, boardSerial: string) => {
    if (e.key === 'Enter') {
      updateName(boardSerial, newName)
    }
  }

  const updateStatus = async (boardSerial: string) => {
    try {
      await FirestoreService.setBoardStatus(boardSerial);
    } catch (error) {
      console.error("Failed to update board status", error);
    }
  }
  
  return (
    <Flex
      flexWrap={"wrap"}
      margin={2}
    >
      {boards.map((board, i) => (
        <Card maxW="sm" key={i} margin={5} borderRadius="10px">
          <Box bg="blue.900" width="100%" height="30px" borderTopRadius="10px"/>
          <CardBody width="400px">
            <Stack spacing="3">
              <Box display="flex" alignItems="center" justifyContent="space-between">
                {changingName === board.serialNumber ? (
                  <Input 
                    type="text" 
                    variant="flushed"
                    size="md"
                    placeholder="Enter new name" 
                    value={newName} 
                    onChange={handleNewName} 
                    onKeyDown={(e) => handleKeyDown(e, board.serialNumber)}
                  />
                ) : (
                  <Heading size="md">{board.name ? board.name : `Board ${i}`}</Heading>
                )}
                <Button justifySelf="end" variant="link" onClick={() => toggleNameChange(board.serialNumber)}><PencilSimpleLine/></Button>
              </Box>
              <Text textOverflow="auto">Location: {board.location}</Text>
              <Box display="flex" alignItems="center">
                <Text>Bin Status:</Text>
                <Text ml="4px" color={board.status === "full" ? 'red.600' : 'green.600'}>{board.status}</Text>
              </Box>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter display="flex" alignItems="center" justifyContent="space-between">
            <Text>{board.serialNumber}</Text>
            <Button justifySelf="end" colorScheme="teal" onClick={() => updateStatus(board.serialNumber)}>Reset Status</Button>
          </CardFooter>
        </Card>
      ))}
    </Flex>
  );
};

export default Cards;
