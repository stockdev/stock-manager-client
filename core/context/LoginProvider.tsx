"use client";
import React, { useEffect, useCallback, useMemo, useState } from "react";
import Cookies from "js-cookie";
import LoginResponse from "../user/dto/LoginResponse";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css"; 
import LoginContextType from "./LoginContextType";
import { toast } from "sonner";
import { ToastMessage } from "../toast/ToastMessage";

type LoginProviderProps = {
  children?: React.ReactNode;
};

export const LoginContext = React.createContext<LoginContextType | undefined>(
  undefined
);

const defaultUserState: LoginResponse = {
  jwtToken: "",
  id: 0,
  fullName: "",
  phone: "",
  email: "",
  userRole: "",
};

const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse>(defaultUserState);
  const router = useRouter();

  const setUserCookie = useCallback((user: LoginResponse): void => {
    setUser(user);
    Cookies.set("user", JSON.stringify(user));
    Cookies.set("authToken", user.jwtToken);
  }, []);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user cookie", error);
        Cookies.remove("user");
      }
    }
  }, []);

  const logOut = useCallback((): void => {
    setUser(defaultUserState);
    Cookies.remove("user");
    Cookies.remove("authToken");
    toast.custom((t) => (
      <ToastMessage
        type="info"
        title="Logged Out"
        message="You have been logged out."
        onClose={() => toast.dismiss(t)}

      />
    ));
    setTimeout(() => {
      router.push("login");
    }, 1000);
  }, [router]);

  const contextValue = useMemo(
    () => ({
      user,
      setUserCookie,
      logOut,
    }),
    [user, setUserCookie, logOut]
  );

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;