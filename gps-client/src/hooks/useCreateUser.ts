import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserAuthContext";
import FirestoreService from '../db/db'; // Adjust the import path as needed

const useCreateUserRole = () => {

  const navigate = useNavigate();
  const { user } = useAuth()!; // Assuming useAuth provides the authenticated user's details

  const handleSubmit = async (role: string, username: string) => {
    if (!user) {
      console.error("No authenticated user found");
      return;
    }
    console.log(user.uid, username, user.email!)
    try {
      switch (role) {
        case 'organization':
          await FirestoreService.addOrganization(user.uid, username, user.email!);
          break;
        case 'client':
          await FirestoreService.addClient(user.uid, username);
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
