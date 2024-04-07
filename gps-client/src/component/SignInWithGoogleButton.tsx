import React from "react";
import { Link } from "@chakra-ui/react";

interface SignInWithGoogleButtonProps {
  signInWithGoogle: () => void;
}

export const SignInWithGoogleButton: React.FC<SignInWithGoogleButtonProps> = ({ signInWithGoogle }) => {
  return (
    <Link color="white" onClick={(e) => {
        e.preventDefault();
        signInWithGoogle();
    }}>
      Sign In with Google
    </Link>
  );
};
