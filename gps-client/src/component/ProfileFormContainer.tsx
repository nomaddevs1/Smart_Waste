import React from 'react';
import {
  Select,
  Button,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  VStack,
  SlideFade,
} from '@chakra-ui/react';
import { DocumentData } from 'firebase/firestore';

interface Props {
  role: string;
  username: string;
  orgName: string;
  orgId: string;
  showFields: boolean;
  orgs: DocumentData[];
  handleRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleFieldChange: (fieldName: string) => (value: string) => void;
  onSubmit: () => void;
}

const ProfileFormContainer: React.FC<Props> = ({
  role,
  username,
  orgName,
  orgId,
  showFields,
  orgs,
  handleRoleChange,
  handleFieldChange,
  onSubmit,
}) => {

    const handleInputChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        handleFieldChange(fieldName)(e.target.value);
      };
      return (
        <Box p="6" borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="blue.900">
          <VStack spacing="4">
            <Heading color="teal.400" size="lg">Complete Your Profile</Heading>
            <FormControl id="role-select">
              <FormLabel color="white">Select Your Role</FormLabel>
              <Select variant="flushed" color="white" placeholder="Select role" value={role} onChange={handleRoleChange}>
                <option value="organization">Organization</option>
                <option value="client">Client</option>
                <option value="collector">Collector</option>
              </Select>
            </FormControl>
            {showFields && (
              <SlideFade in={showFields} offsetY="20px" style={{ width: '100%' }}>
                <FormControl id="username-input">
                  <FormLabel color="white">Username</FormLabel>
                  <Input variant="flushed" color="white" placeholder="Enter your username" value={username} onChange={handleInputChange('username')} />
                </FormControl>
                {role === "organization" && (
                  <FormControl id="org-name-input" mt="20px">
                    <FormLabel color="white">Organization Name</FormLabel>
                    <Input variant="flushed" color="white" placeholder="Enter your organization name" value={orgName} onChange={handleInputChange('orgName')} />
                  </FormControl>
                )}
                {role === "collector" && orgs.length > 0 && (
                  <FormControl id="org-details-input" mt="20px">
                    <FormLabel color="white">Organization</FormLabel>
                    <Select variant="flushed" color="white" placeholder="Select organization" value={orgId} onChange={handleInputChange('orgId')}>
                      {orgs.map((org) => (
                        <option key={org.id} value={org.id}>{org.orgName}</option>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <Box display="flex" justifyContent="center">
                  <Button colorScheme="teal" width="80%" onClick={onSubmit} mt="4" borderRadius="50px">
                    Submit
                  </Button>
                </Box>
              </SlideFade>
            )}
          </VStack>
        </Box>
      );
};

export default ProfileFormContainer;
