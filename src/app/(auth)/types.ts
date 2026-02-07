// src/app/(auth)/types.ts

import { User } from "@/lib/queries";

/** Signup response */
export interface SignupResponse {
  signup: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

/** Login response */
export interface LoginResponse {
  login: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface AuthFormProps {
  mode: "signup" | "login";
  redirectTo?: string;
}

export interface SignupFormFields {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

export interface LoginFormFields {
  username: string;
  password: string;
}
