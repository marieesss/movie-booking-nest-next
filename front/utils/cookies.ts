import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: false, sameSite: "Strict" });
};

export const getAuthToken = (): string | undefined => {
  const cookie = Cookies.get(TOKEN_KEY);
  return cookie
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  const token = Cookies.get("auth_token");
  return !!token; 
};

