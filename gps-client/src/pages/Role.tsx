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
  SlideFade, // Import SlideFade for transitions
} from "@chakra-ui/react";
import useCreateUserRole from "../hooks/useCreateUser";

const RoleSelectionPage = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [orgName, setOrgName] = useState("");
  const [showFields, setShowFields] = useState(false); // State to control the visibility of conditional fields
  const { handleSubmit } = useCreateUserRole();

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
    setShowFields(true); // Trigger fields to show with transition
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleOrgNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrgName(event.target.value);
  };

  const onSubmit = () => {
    if (role === "organization") {
      handleSubmit(role, username, orgName);
    } else {
      handleSubmit(role, username);
    }
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
          // margin="4"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="lg"
          backgroundColor="white"
        >
          <VStack>
            <Heading as="h1" size="lg">
              Complete Your Profile
            </Heading>
            <FormControl id="role-select" w="full">
              <FormLabel>Select Your Role</FormLabel>
              <Select
                placeholder="Select role"
                value={role}
                onChange={handleRoleChange}
              >
                <option value="organization">Organization</option>
                <option value="client">Client</option>
                <option value="collector">Collector</option>
              </Select>
            </FormControl>
            <Box w ="full">
            <SlideFade in={showFields} offsetY="20px" style={{ transitionDuration: '0.9s' }} > {/* Transition effect */}
              {role && (
                <>
                  <FormControl id="username-input" >
                    <FormLabel>Username</FormLabel>
                    <Input
                      placeholder="Enter your username"
                      value={username}
                      onChange={handleUsernameChange}
                      
                    />
                  </FormControl>
                  {role === "organization" && (
                    <FormControl id="org-name-input">
                      <FormLabel>Organization Name</FormLabel>
                      <Input
                        placeholder="Enter your organization name"
                        value={orgName}
                        onChange={handleOrgNameChange}
                      />
                    </FormControl>
                  )}
                </>
              )}
              </SlideFade>
              </Box>
            {showFields && ( // Ensure the submit button also transitions in
              <SlideFade in={true} offsetY="20px">
                <Button
                  colorScheme="teal"
                  width="full"
                  onClick={onSubmit}
                >
                  Submit
                </Button>
              </SlideFade>
            )}
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
};

export default RoleSelectionPage;
