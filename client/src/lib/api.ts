const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
  ) {
    super(message);
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await res.json();

  if (!res.ok || !data.success) {
    throw new ApiError(res.status, data.message ?? "Une erreur est survenue");
  }

  return data.data as T;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  tenantId: string;
  roles: string[];
}

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterPayload {
  email?: string;
  phone?: string;
  password: string;
  tenantId: string;
  firstName: string;
  lastName: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    request<{ accessToken: string; user: User }>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  register: (payload: RegisterPayload) =>
    request<{ user: User }>(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  refresh: () =>
    request<{ accessToken: string; user: User }>(`/auth/refresh`, {
      method: "POST",
    }),

  logout: () =>
    request<null>(`/auth/logout`, { method: "POST" }),

  me: (token: string) =>
    request<User>(`/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  forgotPassword: (payload: { email?: string; phone?: string }) =>
    request<{ message: string }>(`/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resetPassword: (payload: { token: string; newPassword: string }) =>
    request<{ message: string }>(`/auth/reset-password`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
