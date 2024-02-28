import React, { useState } from "react";
import {
  Select,
  Button,
  Box,
  Heading,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // For navigation after selecting a role and username
import { useAuth } from "../context/UserAuthContext";

const RoleSelectionPage = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth()!;
  
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Selected role:", role, "Username:", username);
    // Here, handle the role and username submission (e.g., saving it to a database or updating application state)
    navigate("/dashboard"); // Navigate to another page after selecting a role and entering a username, adjust the path as needed
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Container maxW="container.sm" centerContent>
        <Box
          padding="6"
          margin="4"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="lg"
          backgroundColor="white"
        >
          <VStack spacing={5}>
            <Heading as="h1" size="lg">
              Complete Your Profile
            </Heading>
            <FormControl id="role-select">
              <FormLabel>Select Your Role</FormLabel>
              <Select
                placeholder="Select role"
                value={role}
                onChange={handleRoleChange}
              >
                <option value="organization">Organization</option>
                <option value="client">Client</option>
                <option value="collaborators">Collector</option>
                {/* Add more roles as needed */}
              </Select>
            </FormControl>
            <FormControl id="username-input">
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
              />
            </FormControl>
            <Button colorScheme="blue" width="full" onClick={handleSubmit}>
              Submit
            </Button>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
};

export default RoleSelectionPage;
