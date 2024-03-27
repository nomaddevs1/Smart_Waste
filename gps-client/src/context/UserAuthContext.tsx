import React, { createContext, useContext, useEffect, useState } from "react";
import data from "../auth/firebase";
import {
  UserCredential,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { useToast } from "@chakra-ui/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export interface UserContextState {
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => void;
  signInWithEmailAndPasswordFunc: (email: string, password: string) => Promise<void>;
  signUpWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  user: User | null;
}

export const AuthContext = createContext<UserContextState | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast()
  const auth1 = data.auth;
  useEffect(() => {
    const unsubscribe = auth1.onAuthStateChanged(
      (firebaseUser: User | null) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsLoading(false);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential | null> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth1, provider);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error("Error signing in with Google", error);
      return null;
    }
  };
  const signInWithEmailAndPasswordFunc = async (email: string, password: string): Promise<void> => {
    try {
      const result = await signInWithEmailAndPassword(auth1, email, password);
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in with email and password", error);
      toast({
        title: "Error",
        description: "Failed to sign in. Please check your credentials.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const sendPasswordResetEmailFunc = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth1, email);
      toast({
        title: "Success",
        description: "Password reset email sent successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error sending password reset email", error);
      toast({
        title: "Error",
        description: "Failed to send password reset email.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
 const signUpWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
  try {
    const result = await createUserWithEmailAndPassword(auth1, email, password);
    setUser(result.user);
    toast({
      title: "Account created",
      description: "Your account has been successfully created.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      // Email already used with another auth method. Attempt to link accounts.
      const credential = EmailAuthProvider.credential(email, password);
      signInWithPopup(auth1, new GoogleAuthProvider()).then((googleResult) => {
        linkWithCredential(googleResult.user, credential).then((usercred) => {
          toast({
            title: "Accounts Linked",
            description: "Your email/password is now linked to your Google account.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }).catch((linkError: any) => {
          console.error("Error linking accounts", linkError);
          toast({
            title: "Error Linking Accounts",
            description: linkError.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
      }).catch((signInError) => {
        console.error("Error signing in with Google", signInError);
        toast({
          title: "Sign-In Error",
          description: signInError.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
    } else {
      console.error("Error creating user with email and password", error);
      toast({
        title: "Error creating account",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }
};


  const contextValue = {
    isAuthenticated: !!user,
    isLoading,
    user,
    signInWithGoogle,
    signInWithEmailAndPasswordFunc,
    signUpWithEmailAndPassword,
    sendPasswordResetEmail: sendPasswordResetEmailFunc,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
