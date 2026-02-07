"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
import { ME_QUERY } from "@/lib/graphql"; // Make sure to define this query to fetch current user data

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Initialize auth state safely
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const token = getAccessToken();

      if (token && isMounted) {
        // Optionally, fetch current user here
        setUser((prev) => prev ?? null);
      }

      if (isMounted) setLoading(false);
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

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

      saveTokens(token, refreshToken);
      setUser(user);
      router.push("/feed");
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Invalid credentials");
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

  // Refresh access token
  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      setUser(null);
      router.push("/login");
      throw new Error("No refresh token available");
    }

    try {
      const client = getUnauthenticatedClient();
      const data = await client.request<{
        refreshToken: { token: string; refreshToken: string };
      }>(REFRESH_TOKEN_MUTATION, { refreshToken });

      const { token, refreshToken: newRefreshToken } = data.refreshToken;
      saveTokens(token, newRefreshToken);
    } catch (err) {
      console.error("Token refresh error:", err);
      clearTokens();
      setUser(null);
      router.push("/login");
      throw err;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
  let isMounted = true;

  const initAuth = async () => {
    const token = getAccessToken();

    if (token && isMounted) {
      try {
        const client = getAuthenticatedClient();
        const data = await client.request<{ me: User }>(ME_QUERY); // Make sure you have ME_QUERY defined
        if (isMounted) setUser(data.me);
      } catch (err) {
        console.error("Fetching current user failed:", err);
        clearTokens();
        if (isMounted) setUser(null);
      }
    }

    if (isMounted) setLoading(false);
  };

  initAuth();

  return () => {
    isMounted = false;
  };
}, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        signup,
        login,
        logout,
        refreshAccessToken,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
