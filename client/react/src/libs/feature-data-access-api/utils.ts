import { getAccessToken } from "./auth";

const apiURL = import.meta.env.VITE_API_URL || "/api";

type RequestMethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ClientOptions = {
  data?: Record<string, unknown> | string;
  headers?: Record<string, string>;
  method?: RequestMethodType;
} & RequestInit;

export async function client(
  endpoint: string,
  {
    data: requestData,
    headers: customHeaders,
    ...customConfig
  }: ClientOptions = {}
) {
  const accessToken = getAccessToken();
  const headers: Record<string | "Authorization", string> = {};

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  if (requestData) headers["Content-Type"] = "application/json";

  const config = {
    method: requestData ? "POST" : "GET",
    body: requestData ? JSON.stringify(requestData) : undefined,
    headers: {
      ...headers,
      ...customHeaders,
    },
    ...customConfig,
  };

  const response = await window.fetch(`${apiURL}/${endpoint}`, config);

  if (response.status === 401) return Promise.reject({ message: "Please re-authenticate." });

  const data = await response.json().catch(() => null); // catch in case of empty response
  if (response.ok) return data;
  else return Promise.reject(data);
}
