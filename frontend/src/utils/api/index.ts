import { AI_BASE_URL, BE_BASE_URL } from "@constants/environments";
import CustomError from "src/utils/api/error.ts";
import fetchWithInterceptors from "src/utils/api/fetchInterceptors.ts";

interface Interceptors {
  request?: (url: string, options: RequestInit) => Promise<RequestInit> | RequestInit;
  response?: <T>(response: Response) => Promise<T> | T;
}

export const defaultHeader = {
  "Content-Type": "application/json",
};

class FetchWrapper {
  private baseUrl: string;

  private interceptors: Interceptors;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.interceptors = {
      response: async <T>(response: Response): Promise<T> => {
        if (!response.ok) {
          const errorMessage = await response.text();
          return Promise.reject(
            new CustomError(errorMessage || "서버에 문제가 발생하였습니다.", response.status),
          );
        }
        return response.json();
      },
    };
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    return fetchWithInterceptors<T>(`${this.baseUrl}${url}`, {
      ...options,
      interceptors: this.interceptors,
    });
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { headers: { ...defaultHeader } });
  }

  async put<T, U>(url: string, data: U): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { ...defaultHeader },
      credentials: "include",
    });
  }

  async post<T, U>(url: string, data?: U): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : null,
      headers: { ...defaultHeader },
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, {
      method: "DELETE",
    });
  }
}

const http = { ai: new FetchWrapper(AI_BASE_URL), be: new FetchWrapper(BE_BASE_URL) };

export default http;
