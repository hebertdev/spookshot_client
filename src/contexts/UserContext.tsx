"use client";

import { useState, ReactNode, createContext } from "react";

// helpers
import { deleteToken, getToken } from "helpers/auth";

// services
import { deleteTokenAPI, whoamiAPI } from "services/accounts";
import { UserData } from "interfaces/users";
import { showNotification } from "components/Notifications";

export interface UserContextProps {
  user: UserData | null | undefined;
  logout: () => void;
  loadingUser: boolean;
  toggleLoadingUser: (value: boolean) => void;
  handleGetUser: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext({} as UserContextProps);

export function UserContextProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserData>();
  const [loadingUser, setLoadingUser] = useState(true);

  const logout = async () => {
    try {
      await deleteTokenAPI();
      deleteToken();
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLoadingUser = (value: boolean) => {
    setLoadingUser(value);
  };

  const handleGetUser = async () => {
    if (!getToken()) return;
    try {
      toggleLoadingUser(true);
      const data = await whoamiAPI();
      setUser(data);
      toggleLoadingUser(false);
    } catch (error) {
      toggleLoadingUser(false);
      showNotification({
        title: "Error",
        message: `An error occurred while connecting to SpookShot`,
        color: "red",
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        logout,
        loadingUser,
        toggleLoadingUser,
        handleGetUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
