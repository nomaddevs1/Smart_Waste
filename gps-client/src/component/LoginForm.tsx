import React, { useState } from "react";
import {
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
  FormErrorMessage,
  Link,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { chakra } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

interface LoginFormProps {
  isSignUp: boolean;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, confirmPassword: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isSignUp, onSignIn, onSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      await onSignUp(email, password, confirmPassword);
    } else {
      await onSignIn(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4} p="1rem" mb="20px"alignItems="center" gap="30px">
        <FormControl isRequired>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<CFaUserAlt color="white" />} />
            <Input variant="flushed" type="email" placeholder="email address" onChange={(e) => setEmail(e.target.value)} color="white" />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<CFaLock color="white" />} />
            <Input variant="flushed" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} color="white" />
          </InputGroup>
          {!isSignUp && (
            <Link display="flex" justifyContent="flex-end" color="whiteAlpha.600" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </Link>
          )}         
        </FormControl>
        {isSignUp && (
          <FormControl isRequired>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<CFaLock color="white" />} />
              <Input variant="flushed" type="password" placeholder="confirm password" onChange={(e) => setConfirmPassword(e.target.value)} color="white" />
            </InputGroup>
          </FormControl>
        )}
        <Button type="submit" colorScheme="teal" width="80%" borderRadius="50px" >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </Stack>
    </form>
  );
};
