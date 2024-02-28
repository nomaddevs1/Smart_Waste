import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import {
  UserCredential,
  User,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: React.ReactNode;
}

export interface UserContextState {
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string, emailLink: string) => void;
  signInWithGoogle: () => void;
  user: User | null;
}

export const AuthContext = createContext<UserContextState | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const auth1 = auth;
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
  const signInWithEmailLinkFunc = async (
    email: string,
  ) => {
    sendSignInLinkToEmail(auth1, email, {
      // this is the URL that we will redirect back to after clicking on the link in mailbox
      url: "http://localhost:3000/login",
      handleCodeInApp: true,
    })
      .then(() => {
        localStorage.setItem("email", email);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const contextValue = {
    isAuthenticated: !!user,
    isLoading,
    user,
    signInWithEmail: signInWithEmailLinkFunc,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
