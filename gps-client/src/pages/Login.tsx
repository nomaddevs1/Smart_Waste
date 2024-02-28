import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";

import { FaUserAlt, FaLock, FaGoogle } from "react-icons/fa";
import { useAuth } from "../context/UserAuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useFirstTimeLoginCheck } from "../hooks/useFirstTimeLoginCheck";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const LoginPane = () => {
  const { signInWithEmail: sign , signInWithGoogle, user } = useAuth()!;
  const [email, setEmail] = useState<string>("");
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const isFirstTime = useFirstTimeLoginCheck()
  const navigate = useNavigate();
  const location = useLocation();
  const {search} = location;
  const routes = isFirstTime ? "/roles" : "/"
    useEffect(()=>{
    if(user){ 
      navigate(routes);
    }
    else{
      // user is not signed in but the link is valid
      if(isSignInWithEmailLink(auth, window.location.href)){
        // now in case user clicks the email link on a different device, we will ask for email confirmation
        let email = localStorage.getItem('email');
        if(!email){
          email = window.prompt('Please provide your email');
        }
        // after that we will complete the login process
        //@ts-ignore
        signInWithEmailLink(auth, localStorage.getItem('email'), window.location.href)
        .then((result)=>{
          // we can get the user from result.user but no need in this case
          console.log(result.user);
          localStorage.removeItem('email');
          console.log('Authentication successful, user:', result.user);
          navigate('/login');
        }).catch((err: {message: string})=>{
          navigate('/login');
        })
      }
      else{
        console.log('enter email and sign in');
      }
    }
  },[user, search, navigate]);

  const handleSendLink = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log(window.location.href);
    sign(email, window.location.href);
  };

  const handleGoogleSign = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    signInWithGoogle();
  };

  const validateEmail = (email: string) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setDisabled(!validateEmail(e.target.value));
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
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="email"
                    placeholder="email address"
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                onClick={(e) => handleSendLink(e)}
                isDisabled={isDisabled}
              >
                Sign In With Link
              </Button>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Signup
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        <Link color="teal.500" onClick={(e) => handleGoogleSign(e)}>
          Sign Up with
        </Link>
      </Box>
    </Flex>
  );
};

export default LoginPane;
