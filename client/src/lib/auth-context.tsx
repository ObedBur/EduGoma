"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authApi, type User } from "./api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  /** Impersonation target (plan #3) — null if not impersonating */
  impersonating: { id: string; name: string } | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: {
    email?: string;
    phone?: string;
    password: string;
    tenantId: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  /** Stop impersonation: restore admin token and refresh user */
  stopImpersonation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "edugoma_token";
const TOKEN_BACKUP_KEY = "edugoma_token_backup";
const IMPERSONATING_KEY = "edugoma_impersonating";

function readImpersonating(): { id: string; name: string } | null {
  try {
    const raw = localStorage.getItem(IMPERSONATING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "string" && typeof parsed.name === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [impersonating, setImpersonating] = useState<{ id: string; name: string } | null>(null);

  const setAuth = useCallback((accessToken: string, userData: User) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem(TOKEN_KEY, accessToken);
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_BACKUP_KEY);
    localStorage.removeItem(IMPERSONATING_KEY);
    setImpersonating(null);
  }, []);

  useEffect(() => {
    setImpersonating(readImpersonating());
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      const timer = window.setTimeout(() => setIsLoading(false), 0);
      return () => window.clearTimeout(timer);
    }

    authApi
      .me(stored)
      .then((userData) => {
        setToken(stored);
        setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    const res = await authApi.login({ email, password, rememberMe });
    setAuth(res.accessToken, res.user);
  };

  const register = async (data: {
    email?: string;
    phone?: string;
    password: string;
    tenantId: string;
    firstName: string;
    lastName: string;
  }) => {
    await authApi.register(data);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
    }
  };

  /** Restore admin token after impersonation (plan #3) */
  const stopImpersonation = async () => {
    const backup = localStorage.getItem(TOKEN_BACKUP_KEY);
    const target = readImpersonating();

    // Audit stop on server (best-effort)
    if (target && token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/admin/tenants/${target.id}/impersonate/stop`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
          credentials: "include",
        });
      } catch {
        // ignore — client still restores local session
      }
    }

    localStorage.removeItem(IMPERSONATING_KEY);
    setImpersonating(null);

    if (backup) {
      localStorage.setItem(TOKEN_KEY, backup);
      localStorage.removeItem(TOKEN_BACKUP_KEY);
      try {
        const me = await authApi.me(backup);
        setToken(backup);
        setUser(me);
      } catch {
        clearAuth();
      }
    } else {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, impersonating, login, register, logout, stopImpersonation }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
