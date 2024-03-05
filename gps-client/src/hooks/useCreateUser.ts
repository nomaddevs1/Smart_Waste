import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserAuthContext";
import FirestoreService from '../db/db'; // Adjust the import path as needed
import { useToast } from "@chakra-ui/react";

const useCreateUserRole = () => {

  const navigate = useNavigate();
  const { user } = useAuth()!; // Assuming useAuth provides the authenticated user's details
  const toast = useToast()

  const handleSubmit = async (role: string, username: string, orgName?:string) => {
    if (!user) {
       toast({
        title: "Not Authenticated",
        description: "User not authenticated",
        status: "error",
        isClosable: true,
       });
      navigate('/login')
      return;
    }
    try {
      switch (role) {
        case 'organization':
          await FirestoreService.addOrganization(user.uid, username, user.email!, orgName);
          break;
        case 'client':
          await FirestoreService.addClient(user.uid, username, user.email!);
          break;
        // Implement cases for other roles as needed
        default:
          console.error("Invalid role selected");
      }

      navigate("/dashboard"); // Navigate to the dashboard or another page as needed
    } catch (error) {
      console.error("Error setting up user role:", error);
    }
  };

  return {
    handleSubmit,
  };
};

export default useCreateUserRole;
