import React, { useState, useEffect } from "react";
import { Flex, Avatar, Heading, Box, Link } from "@chakra-ui/react";
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
    <Flex flexDirection="column" width="100wh" height="100vh" justifyContent="center" alignItems="center">
      <Avatar bg="teal.500" />
      <Heading color="teal.400">Welcome Back</Heading>
      <Box minW={{ base: "90%", md: "468px" }}>
        <LoginForm
          isSignUp={isSignUp}
          onSignIn={signInWithEmailAndPasswordFunc}
          onSignUp={async (email: string, password: string) => await signUpWithEmailAndPassword(email, password)}
        />
        <SignInWithGoogleButton signInWithGoogle={signInWithGoogle} />
        <Box>
        <Link color="teal.500" onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </Link>
        </Box>
        <AuthToggleLink isSignUp={isSignUp} toggleSignUp={() => setIsSignUp(!isSignUp)} />
      </Box>
    </Flex>
  );
};

export default LoginPane;
