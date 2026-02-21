"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import {
  getUnauthenticatedClient,
  getAuthenticatedClient,
  saveTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from "@/lib/graphql";
import {
  SIGNUP_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  REFRESH_TOKEN_MUTATION,
} from "@/lib/queries";
import type { User, AuthResponse } from "@/lib/queries";
import { ME_QUERY } from "@/lib/graphql";

interface SignupVariables {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signup: (variables: SignupVariables) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- helpers ----
function getTokenExpMs(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload?.exp) return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

function getFriendlyAuthError(err: unknown): string {
  // graphql-request ClientError usually has: err.response.errors[0].message
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyErr = err as any;
  const gqlMsg =
    anyErr?.response?.errors?.[0]?.message ||
    anyErr?.response?.error ||
    anyErr?.message ||
    "";

  const msg = String(gqlMsg).toLowerCase();

  // Map known auth errors
  if (msg.includes("invalid credentials")) return "Incorrect username or password.";
  if (msg.includes("authentication required")) return "Please log in again.";
  if (msg.includes("no refresh token")) return "Please log in again.";

  // Network-ish errors
  if (
    msg.includes("failed to fetch") ||
    msg.includes("network") ||
    msg.includes("timeout") ||
    msg.includes("ecconn") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("504")
  ) {
    return "Network error. Please try again.";
  }

  // Fallback (never show raw JSON)
  return "Login failed. Please try again.";
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const clearError = () => setError(null);

  const hardLogout = () => {
    clearTokens();
    setUser(null);
    router.push("/login");
  };

  // ✅ Refresh access token (unchanged logic, just cleaner + no silent setUser null unless needed)
  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      hardLogout();
      throw new Error("No refresh token available");
    }

    try {
      const client = getUnauthenticatedClient();
      const data = await client.request<{
        refreshToken: { token: string; refreshToken: string };
      }>(REFRESH_TOKEN_MUTATION, { refreshToken });

      const { token, refreshToken: newRefreshToken } = data.refreshToken;
      if (!token || !newRefreshToken) throw new Error("Invalid refresh response");

      saveTokens(token, newRefreshToken);
    } catch (err) {
      console.error("Token refresh error:", err);
      hardLogout();
      throw err;
    }
  };

  // ✅ Single initAuth effect (REMOVED the duplicate)
  useEffect(() => {
    let alive = true;

    const initAuth = async () => {
      const token = getAccessToken();

      // No token → done
      if (!token) {
        if (alive) setLoading(false);
        return;
      }

      try {
        // If token is expired (or about to), refresh first
        const expMs = getTokenExpMs(token);
        if (expMs && Date.now() > expMs - 60_000) {
          await refreshAccessToken();
        }

        // Fetch current user
        const client = getAuthenticatedClient();
        const data = await client.request<{ me: User }>(ME_QUERY);
        if (alive) setUser(data.me);
      } catch (err) {
        console.error("Init auth failed:", err);
        if (alive) {
          clearTokens();
          setUser(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    initAuth();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Auto-refresh loop (keeps you logged in while idle)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const token = getAccessToken();
      if (!token) return;

      const expMs = getTokenExpMs(token);
      if (!expMs) return;

      // refresh 1 minute before expiry
      const shouldRefresh = Date.now() > expMs - 60_000;

      if (shouldRefresh) {
        try {
          await refreshAccessToken();
        } catch {
          // refreshAccessToken already hard-logs out
        }
      }
    }, 15_000);

    return () => clearInterval(interval);
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Signup
  const signup = async (variables: SignupVariables) => {
    setLoading(true);
    setError(null);

    try {
      const client = getUnauthenticatedClient();
      const data = await client.request<{ signup: AuthResponse }>(
        SIGNUP_MUTATION,
        variables
      );

      const { user, token, refreshToken } = data.signup;
      if (!token || !refreshToken || !user) throw new Error("Invalid signup response");

      saveTokens(token, refreshToken);
      setUser(user);
      router.push("/feed");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign up");
      throw err;
    } finally {
      setLoading(false);
    }
  };


  // Login
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const client = getUnauthenticatedClient();
      const data = await client.request<{ login: AuthResponse }>(LOGIN_MUTATION, {
        username,
        password,
      });

      const { user, token, refreshToken } = data.login;
      if (!token || !refreshToken || !user) throw new Error("Invalid login response");

      saveTokens(token, refreshToken);
      setUser(user);
      router.push("/feed");
    } catch (err) {
      console.error("Login error:", err);

      // ✅ clean message
      setError(getFriendlyAuthError(err));

      throw err;
    } finally {
      setLoading(false);
    }
  };


  // Logout
  const logout = async () => {
    setLoading(true);

    try {
      const client = getAuthenticatedClient();
      await client.request<{ logout: { success: boolean } }>(LOGOUT_MUTATION);
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      clearTokens();
      setUser(null);
      setLoading(false);
      router.push("/login");
    }
  };

  const value: AuthContextType = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated,
      signup,
      login,
      logout,
      refreshAccessToken,
      clearError,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading, error, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
