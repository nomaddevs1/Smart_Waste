import React, { useState } from "react";
import {
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { chakra } from "@chakra-ui/react";

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
      <Stack spacing={4} p="1rem" backgroundColor="blue.900" boxShadow="md">
        <FormControl isRequired>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<CFaUserAlt color="gray.300" />} />
            <Input type="email" placeholder="email address" onChange={(e) => setEmail(e.target.value)} color="white" />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<CFaLock color="gray.300" />} />
            <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} color="white" />
          </InputGroup>
        </FormControl>
        {isSignUp && (
          <FormControl isRequired>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<CFaLock color="gray.300" />} />
              <Input type="password" placeholder="confirm password" onChange={(e) => setConfirmPassword(e.target.value)} color="white" />
            </InputGroup>
          </FormControl>
        )}
        <Button type="submit" colorScheme="teal" width="full">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </Stack>
    </form>
  );
};
