import React, { useState, useEffect } from "react";
import { Flex, Avatar, Heading, Box } from "@chakra-ui/react";
import { useAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { useFirstTimeLoginCheck } from "../hooks/useFirstTimeLoginCheck";
import { SignInWithGoogleButton } from "../component/SignInWithGoogleButton";
import { AuthToggleLink } from "../component/AuthToggleLink";
import { LoginForm } from "../component/LoginForm";

const LoginPane = () => {
  const { signInWithGoogle, signUpWithEmailAndPassword, signInWithEmailAndPasswordFunc, user, isLoading } = useAuth()!;
  const isFirstTime = useFirstTimeLoginCheck();
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate(isFirstTime ? "/roles" : "/dashboard");
    }
  }, [user, navigate, isFirstTime, isLoading]);

  return (
    <Flex width="100wh" height="100vh" alignItems="center" justifyContent="center">
      <Flex 
        bg="blue.900" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        width={{base: "90%", md: "30rem"}} 
        height="auto"
        borderRadius="10px" 
        boxShadow="md"
        p="2rem 0"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">{isSignUp ? "Welcome" : "Welcome Back"}</Heading>
        <Box width="100%" p="0 10% 0%" mt="1rem">
          <LoginForm
            isSignUp={isSignUp}
            onSignIn={signInWithEmailAndPasswordFunc}
            onSignUp={async (email: string, password: string) => await signUpWithEmailAndPassword(email, password)}
          />
          <Box display="flex" flexDirection="column" alignItems="center">
            <SignInWithGoogleButton signInWithGoogle={signInWithGoogle} />
            <AuthToggleLink isSignUp={isSignUp} toggleSignUp={() => setIsSignUp(!isSignUp)} />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default LoginPane;
