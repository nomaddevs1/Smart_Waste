import React, { useEffect, useState } from "react";
import {
  Container,
  Flex
} from "@chakra-ui/react";
import useCreateUserRole from "../hooks/useCreateUser";
import FirestoreService from "../db/db";
import { DocumentData } from "firebase/firestore";
import ProfileFormContainer from "../component/ProfileFormContainer";

const RoleSelectionPage = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [orgs, setOrgs] = useState<DocumentData[]>([]);
  const { handleSubmit } = useCreateUserRole();

  useEffect(() => {
    const fetchOrgs = async () => {
      const data = await FirestoreService.getAllOrg();
      setOrgs(data || []);
    };
    fetchOrgs();
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
    setShowFields(true);
  };

  const handleFieldChange = (fieldName: string) => (value: string) => {
    switch(fieldName) {
      case 'username':
        setUsername(value);
        break;
      case 'orgName':
        setOrgName(value);
        break;
      case 'orgId':
        setOrgId(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = async () => {
    try {
      if (role === "organization") {
        await handleSubmit(role, username, orgName);
      } else if (role === "collector") {
        await handleSubmit(role, username, orgId);
      } else {
        await handleSubmit(role, username);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100vw"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Container maxW="container.sm" centerContent>
      <ProfileFormContainer
        role={role}
        username={username}
        orgName={orgName}
        orgId={orgId}
        showFields={showFields}
        handleFieldChange={handleFieldChange}
        orgs={orgs}
        handleRoleChange={handleRoleChange}
        onSubmit={onSubmit}
      />
      </Container>
    </Flex>
  );
};

export default RoleSelectionPage;
