import React from "react";
import { Link } from "@chakra-ui/react";

interface AuthToggleLinkProps {
  isSignUp: boolean;
  toggleSignUp: () => void;
}

export const AuthToggleLink: React.FC<AuthToggleLinkProps> = ({ isSignUp, toggleSignUp }) => {
  return (
    <Link cursor="pointer" color="white" onClick={toggleSignUp}>
      {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
    </Link>
  );
};
