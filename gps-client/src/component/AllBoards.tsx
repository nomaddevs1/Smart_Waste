import { useState, useEffect } from "react";
import { Box, Heading, Stack, StackDivider, Card, CardHeader, Button } from "@chakra-ui/react";
import FirestoreService from "../db/db";

const AllBoards = () => {
  const [orgs, setOrgs] = useState<any>([]);

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

  return (
    <Box ml="2rem">
      <Heading fontSize="2xl" mb="4">All Organizations</Heading>
      {orgs.map((org: any) => (
        <Card mb="4" key={org.id} width="30rem" borderRadius="10px">
          <CardHeader display="flex" alignItems="center" justifyContent="space-between" bgColor="blue.900" borderTopRadius="5px">
            <Heading fontSize="lg" color="white">{org.data.orgName}</Heading>
            <Button colorScheme="teal" color="white" justifySelf="end">Buy Board</Button>
          </CardHeader>
          <Stack ml="1rem" divider={<StackDivider />}>
            {org.data.boards.map((board: any) => (
              <Box p="1rem" key={board}>Serial Number: {board}</Box>
            ))}
          </Stack>
        </Card>
      ))}
    </Box>
  );
}

export default AllBoards;