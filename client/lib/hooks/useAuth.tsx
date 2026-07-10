"use client";

import { useContext, createContext, ReactNode, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, UserRole } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => Promise<User>;
  googleLogin: (email: string, name: string) => Promise<User>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}/api/auth${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}

async function fetchCurrentUser(): Promise<User> {
  const response = await request<{ success: boolean; data: { user: User } }>(
    "/me",
  );
  return response.data.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const authQuery = useQuery<User, Error>({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation<
    User,
    Error,
    { email: string; password: string }
  >({
    mutationFn: async ({ email, password }) => {
      const response = await request<{
        success: boolean;
        data: { user: User };
      }>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return response.data.user;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["auth", "me"], userData);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const signupMutation = useMutation<
    User,
    Error,
    { email: string; password: string; name: string; role: UserRole }
  >({
    mutationFn: async ({ email, password, name, role }) => {
      const response = await request<{
        success: boolean;
        data: { user: User };
      }>("/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name, role }),
      });
      return response.data.user;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["auth", "me"], userData);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const logoutMutation = useMutation<void, Error>({
    mutationFn: async () => {
      await request<{ success: boolean; message: string }>("/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const googleMutation = useMutation<
    User,
    Error,
    { email: string; name: string }
  >({
    mutationFn: async ({ email, name }) => {
      const response = await request<{
        success: boolean;
        data: { user: User };
      }>("/google", {
        method: "POST",
        body: JSON.stringify({ email, name, role: "buyer" }),
      });
      return response.data.user;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["auth", "me"], userData);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const login = async (email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => {
    return signupMutation.mutateAsync({ email, password, name, role });
  };

  const googleLogin = async (email: string, name: string) => {
    return googleMutation.mutateAsync({ email, name });
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user: authQuery.data ?? null,
      isLoading:
        authQuery.isPending ||
        loginMutation.isPending ||
        signupMutation.isPending ||
        logoutMutation.isPending ||
        googleMutation.isPending,
      login,
      logout,
      signup,
      googleLogin,
      isAuthenticated: !!authQuery.data,
    }),
    [
      authQuery.data,
      authQuery.isPending,
      loginMutation.isPending,
      signupMutation.isPending,
      logoutMutation.isPending,
      googleMutation.isPending,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
