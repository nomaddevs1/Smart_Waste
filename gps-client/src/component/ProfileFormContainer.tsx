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
            <Heading size="lg">Complete Your Profile</Heading>
            <FormControl id="role-select">
              <FormLabel>Select Your Role</FormLabel>
              <Select placeholder="Select role" value={role} onChange={handleRoleChange}>
                <option value="organization">Organization</option>
                <option value="client">Client</option>
                <option value="collector">Collector</option>
              </Select>
            </FormControl>
            {showFields && (
              <SlideFade in={showFields} offsetY="20px" style={{ width: '100%' }}>
                <FormControl id="username-input">
                  <FormLabel>Username</FormLabel>
                  <Input placeholder="Enter your username" value={username} onChange={handleInputChange('username')} />
                </FormControl>
                {role === "organization" && (
                  <FormControl id="org-name-input">
                    <FormLabel>Organization Name</FormLabel>
                    <Input placeholder="Enter your organization name" value={orgName} onChange={handleInputChange('orgName')} />
                  </FormControl>
                )}
                {role === "collector" && orgs.length > 0 && (
                  <FormControl id="org-details-input">
                    <FormLabel>Select your org</FormLabel>
                    <Select placeholder="Select your organization" value={orgId} onChange={handleInputChange('orgId')}>
                      {orgs.map((org) => (
                        <option key={org.id} value={org.id}>{org.orgName}</option>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <Button colorScheme="teal" width="full" onClick={onSubmit} mt="4">
                  Submit
                </Button>
              </SlideFade>
            )}
          </VStack>
        </Box>
      );
};

export default ProfileFormContainer;
