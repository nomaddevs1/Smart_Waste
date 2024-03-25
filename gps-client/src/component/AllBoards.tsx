import { useState, useEffect } from "react";
import { Box, Text, List, ListItem } from "@chakra-ui/react";
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
      <Text fontSize="2xl" mb="4">All Organizations</Text>
      {orgs.map((org: any) => (
        <Box ml="2rem" mb="4" key={org.id}>
          <Text fontSize="lg">{org.data.orgName}</Text>
          <List ml="1rem">
            {org.data.boards.map((board: any) => (
              <ListItem key={board}>Serial Number: {board}</ListItem>
            ))}
          </List>
        </Box>
      ))}
      <List>

      </List>
    </Box>
  );
}

export default AllBoards;