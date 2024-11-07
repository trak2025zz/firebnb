import { configureAuth } from "react-query-auth";
import { client } from "./utils";

export type User = {
  email: string;
};

type Error = {
  message: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  password: string;
};
export function getAccessToken() {
  return localStorage.getItem("token");
}

export function setAccessToken(token: string) {
  localStorage.setItem("token", token);
}

export function removeTokens() {
  localStorage.removeItem("token");
}

export const { useUser, useLogin, useRegister, useLogout } = configureAuth<
  User | null,
  Error,
  LoginCredentials,
  RegisterCredentials
>({
  userFn: async () => {
    const token = getAccessToken();
    if (!token) return null;

    try {
      return await client("auth/me");
    } catch {
      return null;
    }
  },
  loginFn: async (data: LoginCredentials) => {
    const response = await client("auth/login", {
      method: "POST",
      data,
    });

    setAccessToken(response?.token);

    return { email: data.email };
  },
  registerFn: async (data: RegisterCredentials) => {
    await client("user/create", { method: "POST", data });

    return null;
  },
  logoutFn: async () => {
    removeTokens();

    window.location.href = "/";
    return null;
  },
});
