import { createContext, useEffect, useState } from "react";
import { client } from "../appwrite";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const { data } = await client.account.get();
        setCurrentUser(data);
      } catch (error) {
        setCurrentUser(null);
      }
    };

    checkCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
