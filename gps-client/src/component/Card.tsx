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
import { DocumentData } from "firebase/firestore";
import { PencilSimpleLine } from "@phosphor-icons/react";
import FirestoreService from "../db/db";
import React, { useState } from "react";

const Cards = ({ boards }: { boards: DocumentData[] | [] }) => {
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
    <Flex flexWrap={"wrap"} margin={2}>
      {boards.map((board, i) => (
        <Card maxW="sm" key={i} margin={5}>
          <CardBody>
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
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
              <Text>Location:     {board.location}</Text>
              <Box display="flex" alignItems="center">
                <Text>Bin Status:</Text>
                <Text ml="4px" color={board.status === "full" ? 'red.500' : 'green.500'}>{board.status}</Text>
              </Box>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter display="flex" alignItems="center" justifyContent="space-between">
            <Text>{board.serialNumber}</Text>
            <Button justifySelf="end" onClick={() => updateStatus(board.serialNumber)}>Reset Status</Button>
          </CardFooter>
        </Card>
      ))}
    </Flex>
  );
};

export default Cards;
