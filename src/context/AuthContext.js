import { createContext, useEffect, useState } from "react";
import { account } from "../appwrite";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const { name } = await account.get();
        setCurrentUser(name);
      } catch (error) {
        console.error("Failed to get current user:", error);
        setCurrentUser(null);
      }
    };

    checkCurrentUser();
  }, []);
  
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};