import { useEffect, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";

export const useFirstTimeLoginCheck = () => {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const creationTime = new Date(user.metadata.creationTime!).getTime();
        const lastSignInTime = new Date(user.metadata.lastSignInTime!).getTime();
        // Consider it a first login if the account was created within the last 5 minutes
        const threshold = 5 * 60 * 1000; // 5 minutes in milliseconds
        const isFirstLoginCheck = lastSignInTime - creationTime < threshold;
        setIsFirstLogin(isFirstLoginCheck);
      } else {
        setIsFirstLogin(false);
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  // Use another useEffect to log the state when it changes
  useEffect(() => {
  }, [isFirstLogin]);

  return isFirstLogin;
};