import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const jwtDecode = require("jwt-decode");

interface AuthProps {
  authState?: {
    token: string | null;
    isAuthenticated: boolean | null;
    isExpired: boolean | null;
  };
  onRegister?: (
    fullname: string,
    username: string,
    password: string
  ) => Promise<any>;
  onLogin?: (username: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

interface DecodedToken {
  exp: number;
}

const TOKEN_KEY = "token";

export const BASEURL = "http://192.168.100.49:3000/api";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    isAuthenticated: boolean | null;
    isExpired: boolean | null;
  }>({
    token: null,
    isAuthenticated: null,
    isExpired: null,
  });

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthState({
          token: token,
          isAuthenticated: true,
          isExpired: isTokenExpired(token),
        });
      }
    };

    loadToken();
  }, []);

  const RegisterUser = async (
    fullname: string,
    username: string,
    password: string
  ) => {
    try {
      return await axios.post(`${BASEURL}/auth/register_user`, {
        fullname,
        username,
        password,
      });
    } catch (error) {
      return { error: true, message: (error as any).response.data.message };
    }
  };

  const SignInUser = async (username: string, password: string) => {
    try {
      const loginRequest = await axios.post(`${BASEURL}/auth/sign_in_user`, {
        username,
        password,
      });
      if (loginRequest.status === 200) {
        const responseData = loginRequest.data;
        setAuthState({
          token: responseData.token,
          isAuthenticated: true,
          isExpired: isTokenExpired(responseData.token),
        });

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${responseData.token}`;

        await SecureStore.setItemAsync(TOKEN_KEY, responseData.token);

        return responseData;
      }
    } catch (error) {
      return { error: true, message: (error as any).response.data.message };
    }
  };

  const LogoutUser = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      isAuthenticated: false,
      isExpired: null,
    });

    setTimeout(() => {
      router.navigate('sign_in')
    }, 2000)
  };

  const value = {
    onRegister: RegisterUser,
    onLogin: SignInUser,
    onLogout: LogoutUser,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
