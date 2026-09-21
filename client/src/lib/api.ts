const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
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
  const token = typeof window !== "undefined" ? localStorage.getItem("edugoma_token") : null;
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    let errorMessage = "Une erreur est survenue";
    if (typeof json.message === "string") {
      errorMessage = json.message;
    } else if (json.message && typeof json.message === "object" && "message" in json.message) {
      errorMessage = (json.message as Record<string, unknown>).message as string;
    }
    throw new ApiError(res.status, errorMessage);
  }

  return json.data as T;
}

// ── Stats API ──────────────────────────────────────────────

export interface SummaryStats {
  schools: {
    active: number;
    total: number;
    trend: string;
    activityRate: number;
    provinces: number;
  };
  pendingDossiers: {
    count: number;
    urgent: number;
    avgValidationHours: number;
  };
  users: {
    total: number;
    trend: string;
    activeToday: number;
  };
  students: {
    total: number;
    trend: string;
    renewalRate: number;
  };
}

export interface GrowthData {
  months: number;
  labels: string[];
  schools: number[];
  students: number[];
}

export interface MetricsData {
  onboarding: {
    avgHours: number;
    trend: number;
    trendLabel: string;
  };
  completionRate: {
    rate: number;
    note: string;
  };
  storage: {
    usedGB: number;
    note: string;
  };
}

export interface ActivityLogItem {
  type: string;
  title: string;
  text: string;
  school: string | null;
  user: string;
  time: string;
}

export const statsApi = {
  getSummary: () => request<SummaryStats>("/admin/stats/summary"),

  getGrowth: (months = 6) =>
    request<GrowthData>(`/admin/stats/growth?months=${months}`),

  getMetrics: () => request<MetricsData>("/admin/stats/metrics"),

  getActivityLog: (limit = 5) =>
    request<ActivityLogItem[]>(`/admin/activity-log?limit=${limit}`),
};

// ── Alerts API ─────────────────────────────────────────────

export interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  source: string | null;
  createdAt: string;
}

export const alertsApi = {
  getPriority: (limit = 10) =>
    request<Alert[]>(`/admin/alerts/priority?limit=${limit}`),

  resolve: (id: string) =>
    request<null>(`/admin/alerts/${id}/resolve`, { method: "PATCH" }),
};

// ── Tickets API ────────────────────────────────────────────

export interface Ticket {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  priority: string;
  schoolName: string | null;
  schoolId: string | null;
  requester: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  urgent: number;
}

export const ticketsApi = {
  get: (params?: { status?: string; priority?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.priority) qs.set("priority", params.priority);
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    return request<Ticket[]>(`/admin/support/tickets${q ? `?${q}` : ""}`);
  },

  getStats: () => request<TicketStats>("/admin/support/tickets/stats"),
};

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
