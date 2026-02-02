// src/app/(auth)/types.ts

/** User info returned from API */
export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
}

/** Response from Signup mutation */
export interface SignupResponse {
  signup: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

/** Response from Login mutation */
export interface LoginResponse {
  login: {
    user: User;
    token: string;
  };
}

/** Props for AuthForm component */
export interface AuthFormProps {
  mode: "signup" | "login"; // determines whether form is signup or login
  redirectTo?: string;       // optional redirect URL after success
}

/** Form input fields for signup */
export interface SignupFormFields {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

/** Form input fields for login */
export interface LoginFormFields {
  username: string;
  password: string;
}
