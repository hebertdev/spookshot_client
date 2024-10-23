import Axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// Auth helpers
import { getToken, deleteToken } from "helpers/auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const headers: Record<string, string> = {};

function verifiedToken(): string | undefined {
  if (getToken()) {
    headers.Authorization = `token ${getToken()}`;
    return headers.Authorization;
  }
}

verifiedToken();

export const axiosInstanceBackend: AxiosInstance = Axios.create({
  baseURL: baseURL,
  headers,
});

export function axiosInterceptors() {
  axiosInstanceBackend.interceptors.response.use(
    function (response: AxiosResponse) {
      return response;
    },
    function (error: AxiosError) {
      if (error?.response?.status === 401) {
        deleteToken();
        window.location.href = "/accounts/login";
      } else {
        return Promise.reject(error);
      }
    }
  );
}
