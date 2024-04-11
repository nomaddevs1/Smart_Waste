import { useState, useEffect, useRef } from "react";
import { Box, Heading, Stack, StackDivider, Card, CardHeader, Button } from "@chakra-ui/react";
import FirestoreService from "../db/db";
import { useAuth } from "../context/UserAuthContext";

const AllBoards = () => {
  const [orgs, setOrgs] = useState<any>([]);
  const { user } = useAuth()!;
  const roleRef = useRef("");

  useEffect(() => {
    (async () => {
      if (user){
      roleRef.current = await FirestoreService.getUserRole(user!.uid) as string
      }
    })()
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizations = await FirestoreService.getAllOrg();
        setOrgs(organizations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  
  const buyBoard = async (boardSerial: string) => {
    try {
      await FirestoreService.assignBoardToClient(boardSerial, user!.uid);
      console.log("Added client Id to board");
    } catch (error) {
      console.error("Error adding client Id to board", error);
    }
  }

  return (
    <Box ml="2rem">
      <Heading fontSize="2xl" mb="4">All Organizations</Heading>
      {orgs.map((org: any) => (
        <Card mb="4" key={org.id} width="30rem" borderRadius="10px">
          <CardHeader bgColor="blue.900" borderTopRadius="5px">
            <Heading fontSize="lg" color="white">{org.orgName}</Heading>
          </CardHeader>
          <Stack divider={<StackDivider />}>
            {org.boards.map((board: any) => (
              <Box key={board} display="flex" alignItems="center" justifyContent="space-between" p="1rem">
                <Box>Serial Number: {board}</Box>
                {roleRef.current === "client" && (
                  <Button onClick={() => buyBoard(board)} colorScheme="teal" color="white" justifySelf="end">
                    Buy Board
                  </Button>
                )}
              </Box>
            ))}
          </Stack>
        </Card>
      ))}
    </Box>
  );
}

export default AllBoards;