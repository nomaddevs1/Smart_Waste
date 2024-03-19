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
  IconButton,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useAuth } from "../context/UserAuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import  data from "../auth/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useFirstTimeLoginCheck } from "../hooks/useFirstTimeLoginCheck";
import { GoogleLogo } from "@phosphor-icons/react";
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const LoginPane = () => {
  const { signInWithEmail: sign , signInWithGoogle, user } = useAuth()!;
  const [email, setEmail] = useState<string>("");
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const isFirstTime = useFirstTimeLoginCheck()
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = location;
  const { auth } = data
  
  const routes = isFirstTime ? "/roles" : "/dashboard"
    useEffect(()=>{
      if (user) { 
  
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
          localStorage.removeItem('email');
          navigate('/roles');
        }).catch((err: {message: string})=>{
          navigate('/login');
        })
      }
      
    }
  },[user, search, navigate, auth, routes]);

  const handleSendLink = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    sign(email, window.location.href);
  };

  const handleGoogleSign = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    signInWithGoogle();
  };

  const validateEmail = (email: string) => {
    //@ts-ignore
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
              backgroundColor="blue.900"
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
                    color={"black"}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="black" />}
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
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        <Link color="teal.500" onClick={(e) => handleGoogleSign(e)}>
          Sign In with <IconButton icon={<GoogleLogo size={32} color="#3b8791" weight="fill" />} aria-label="google" background={"transparent"}/>
        </Link>
      </Box>
    </Flex>
  );
};

export default LoginPane;
