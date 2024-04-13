import React, { useState } from "react";
import {
  Button,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useToast,
  Link,
  Text,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { chakra } from "@chakra-ui/react";


const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

interface LoginFormProps {
  isSignUp: boolean;
  isForgot: boolean;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, confirmPassword: string) => Promise<void>;
  onForgot: (email:string) => Promise<void>;
  toggleForgot: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ isSignUp,isForgot, onSignIn, onSignUp, onForgot, toggleForgot }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isForgot && (!email || !password)) {
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
      if(isForgot){
        await onForgot(email)
      }else{
      await onSignIn(email, password);}
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4} p="1rem" mb="20px"alignItems="center" gap="30px">
        {isForgot && (
          <Text color="white">Enter the email associated with your account to recieve a password reset link.</Text>
        )}
        <FormControl isRequired>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<CFaUserAlt color="white" />} />
            <Input variant="flushed" type="email" placeholder="email address" onChange={(e) => setEmail(e.target.value)} color="white" />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
        {!isForgot && ( 
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<CFaLock color="white" />} />
            <Input variant="flushed" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} color="white" />
          </InputGroup>)
          }
          {!isSignUp && (
            <Link display="flex" justifyContent="flex-end" color="whiteAlpha.600" onClick={() =>toggleForgot()}>
              {!isForgot? "Forgot Password?": "Cancel"}
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
          {!isForgot ?(isSignUp ? "Sign Up" : "Sign In"): "Reset Password"}
        </Button>
      </Stack>
    </form>
  );
};
