import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { client } from "./utils";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";

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

export function useLogin() {
  const mutation = useMutation({
    mutationFn: async (data: LoginCredentials) => {
      return await client("auth/login", {
        method: "POST",
        data,
      });
    },
    onError() {
      toast.error("Invalid email or password!");
    },
    onSuccess(data) {
      setAccessToken(data?.token);
      window.location.reload();
    }
  });

  return mutation;
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterCredentials) => {
      return await client("user/create", {
        method: "POST",
        data,
      });
    },
    onError(e: { errors: { msg: string }[] }) {
      toast.error(e.errors[0]?.msg);
    },
    async onSuccess() {
      await router.push("/");
      toast.success("Account created successfully!");
    },
  });
}

export function logout() {
  removeTokens();
  window.location.href = "/";

  return null;
}

export function useUser() {
  const token = getAccessToken();

  return useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      return await client("auth/me");
    },
    enabled: !!token,
  });
}
