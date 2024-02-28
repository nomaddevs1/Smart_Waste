
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export const useFirstTimeLoginCheck = () => {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const creationTime = new Date(Number(user.metadata.creationTime)).getTime();
        const lastSignInTime = new Date(Number(user.metadata.lastSignInTime)).getTime();
        // Consider it a first login if the account was created within the last 5 minutes
        const threshold = 5 * 60 * 1000; // 5 minutes in milliseconds
        const isFirstLogin = lastSignInTime - creationTime < threshold;
        setIsFirstLogin(isFirstLogin);
      } else {
        setIsFirstLogin(false);
      }
    });

    return unsubscribe;
  }, []);

  return isFirstLogin;
};
