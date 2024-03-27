import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const LoginPane = () => {
  const { signInWithGoogle,signUpWithEmailAndPassword, signInWithEmailAndPasswordFunc, user } = useAuth()!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpToggle, setSignUpToggle] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // Adjust the redirect as needed
    }
  }, [user, navigate]);

  const handleEmailPasswordSignUp = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Please enter both email and password.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    } else if (password != confirmPassword) { 
       toast({
        title: "Password and confirm password not matching",
        status: "warning",
        duration: 9000,
        isClosable: true,
       });
      return;
    }
    await signUpWithEmailAndPassword(email, password);
  }

  const handleEmailPasswordSignIn = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Please enter both email and password.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    await signInWithEmailAndPasswordFunc(email, password);
  };

  const handleGoogleSignIn = async (e: any) => {
    e.preventDefault();
    await signInWithGoogle();
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome Back</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={signUpToggle ?handleEmailPasswordSignIn : handleEmailPasswordSignUp}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="blue.900"
              boxShadow="md"
            >
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="email"
                    placeholder="email address"
                    onChange={(e) => setEmail(e.target.value)}
                    color={"white"}
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                    color={"white"}
                  />
                </InputGroup>
              </FormControl>
              {
                signUpToggle ? <> </> : <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type="password"
                    placeholder="confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    color={"white"}
                  />
                </InputGroup>
              </FormControl>
              }
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                disabled={password !== confirmPassword}
              >
                {signUpToggle ? "Sign In" : "Sign Up"}
              </Button>
              <Link color="teal.500" onClick={handleGoogleSignIn}>
                Sign In with Google
              </Link>
              <Text cursor="pointer" color="teal.300" onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </Text>
              <Text cursor="pointer" color="teal.300" onClick={() => setSignUpToggle(!signUpToggle)}>
               {signUpToggle ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </Text>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPane;
