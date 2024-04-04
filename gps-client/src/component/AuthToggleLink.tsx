import React from "react";
import { Text } from "@chakra-ui/react";

interface AuthToggleLinkProps {
  isSignUp: boolean;
  toggleSignUp: () => void;
}

export const AuthToggleLink: React.FC<AuthToggleLinkProps> = ({ isSignUp, toggleSignUp }) => {
  return (
    <Text cursor="pointer" color="teal.300" onClick={toggleSignUp}>
      {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
    </Text>
  );
};
