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
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email?: string;
    phone?: string;
    password: string;
    tenantId: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "edugoma_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = useCallback((accessToken: string, userData: User) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem(TOKEN_KEY, accessToken);
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
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

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
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

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
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
