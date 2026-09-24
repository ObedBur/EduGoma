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
  counts: {
    all: number;
    active: number;
    pending: number;
    suspended: number;
    trial: number;
    overdue: number;
  };
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
    avgValidationHours: number | null;
  };
  users: {
    total: number;
    trend: string;
    activeToday: number;
  };
  students: {
    total: number;
    trend: string;
    renewalRate: number | null;
  };
}

export interface GrowthData {
  months: string[];
  labels: string[];
  schools: number[];
  students: number[];
}

export interface MetricsData {
  onboarding: {
    avgHours: number | null;
    trend: number | null;
    trendLabel: string;
  };
  completionRate: {
    rate: number | null;
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

export const ticketsApi = {
  get: (params?: { status?: string; priority?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.priority) qs.set("priority", params.priority);
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    return request<Ticket[]>(`/admin/support/tickets${q ? `?${q}` : ""}`);
  },
};

// ── Health API ──────────────────────────────────────────────

export interface SystemHealth {
  status: "healthy" | "degraded";
  uptime: string;
  uptimeMs: number;
  timestamp: string;
  database: {
    status: "connected" | "error";
    latencyMs: number;
  };
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssUsedMB: number;
    externalMB: number;
    usagePercent: number;
  };
  stats: {
    totalTenants: number;
    totalUsers: number;
  };
}

export const healthApi = {
  getSystemHealth: () => request<SystemHealth>("/admin/system/health"),
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
  rememberMe?: boolean;
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

  getSetupInfo: (token: string) =>
    request<{ schoolName: string; expiresAt: string }>(`/auth/setup/${token}`),

  completeSetup: (token: string, password: string) =>
    request<{ message: string }>(`/auth/setup/${token}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
};

export interface CreateTenantPayload {
  name: string;
  phone: string;
  email?: string;
  commune?: string;
  type?: string;
}

export type ChannelNotifyStatus = boolean | null;

export interface ValidateAccessResult {
  message?: string;
  notifications?: {
    sms: ChannelNotifyStatus;
    whatsapp: ChannelNotifyStatus;
    email: ChannelNotifyStatus;
  };
  setupLinkExpiresAt?: string;
}

export const tenantsApi = {
  create: (payload: CreateTenantPayload) =>
    request<{ id: string; name: string }>(`/admin/tenants`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** Liste paginée — params construits via toListParams() de list-table */
  getList: (params: string) =>
    request<PaginatedTenants>(`/admin/tenants?${params}`),

  getPending: () => request<TenantSummary[]>(`/admin/tenants/pending`),
  getActive: () => request<TenantSummary[]>(`/admin/tenants/active`),
  getSuspended: () => request<TenantSummary[]>(`/admin/tenants/suspended`),
  getUsers: (id: string) => request<TenantUser[]>(`/admin/tenants/${id}/users`),
  /** Per-school stats: users, honest student proxy, documents (plan #2) */
  getStats: (id: string) => request<SchoolStats>(`/admin/tenants/${id}/stats`),
  /** Impersonate a school: short-lived token with imp claim (plan #3) */
  impersonate: (id: string) =>
    request<ImpersonateResult>(`/admin/tenants/${id}/impersonate`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  stopImpersonation: (id: string) =>
    request<{ message: string }>(`/admin/tenants/${id}/impersonate/stop`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  validate: (id: string, payload: { validatedBy: string }) =>
    request<ValidateAccessResult>(`/admin/tenants/${id}/validate`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  resendAccess: (id: string) =>
    request<ValidateAccessResult>(`/admin/tenants/${id}/resend-access`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  deactivate: (id: string, reason?: string) =>
    request<{ message: string }>(`/admin/tenants/${id}/deactivate`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  reactivate: (id: string) =>
    request<{ message: string }>(`/admin/tenants/${id}/reactivate`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
  markSubscriptionPaid: (id: string) =>
    request<{
      id: string;
      subscription: string;
      subscriptionTone: string;
      subscriptionDetail: string;
    }>(`/admin/tenants/${id}/subscription`, {
      method: "PATCH",
      body: JSON.stringify({ action: "mark_paid" }),
    }),
};

export interface TenantListCounts {
  all: number;
  active: number;
  pending: number;
  suspended: number;
  trial: number;
  overdue: number;
}

export interface PaginatedTenants {
  items: TenantSummary[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    counts: TenantListCounts;
  };
}

export interface TenantSummary {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  commune: string | null;
  type: string | null;
  status: string;
  createdAt: string;
  validatedAt?: string | null;
  validatedBy?: string | null;
  subscriptionStatus?: string;
  subscriptionPaidAt?: string | null;
  /** From listTenants _count.users */
  _count?: { users: number };
}

export interface SchoolStats {
  users: number;
  usersActive: number;
  students: number | null;
  documents: { provided: string[]; missing: string[] };
  note: string;
}

export interface ImpersonateResult {
  accessToken: string;
  tenant: { id: string; name: string };
}

export interface TenantUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  userRoles: { role: { name: string } }[];
}

export interface DemoRequest {
  id: string;
  contactName: string;
  schoolName: string;
  phone: string;
  email: string | null;
  studentRange: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

export const demoRequestsApi = {
  getAll: () => request<DemoRequest[]>(`/admin/demo-requests`),
  updateStatus: (id: string, status: string) =>
    request<DemoRequest>(`/admin/demo-requests/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
