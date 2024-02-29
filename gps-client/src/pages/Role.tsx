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
import useCreateUserRole from "../hooks/useCreateUser";

const RoleSelectionPage = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const { handleSubmit } = useCreateUserRole();

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
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
            <Button
              colorScheme="blue"
              width="full"
              onClick={() => handleSubmit(role, username)}
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
};

export default RoleSelectionPage;
