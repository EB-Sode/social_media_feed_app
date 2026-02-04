import { graphqlClient } from "@/lib/graphql";

// Types
export interface SignupVariables {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

export interface LoginVariables {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
  refreshToken?: string;
}

// GraphQL Mutations
const SIGNUP_MUTATION = `
  mutation Signup($username: String!, $email: String!, $password: String!, $bio: String) {
    signup(username: $username, email: $email, password: $password, bio: $bio) {
      user { id username email }
      token
      refreshToken
    }
  }
`;

const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user { id username email }
      token
    }
  }
`;

const FORGOT_PASSWORD_MUTATION = `
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      success
      message
    }
  }
`;

// API Functions
export const signup = async (variables: SignupVariables) => {
  const data = await graphqlClient.request<{ signup: AuthResponse }>(
    SIGNUP_MUTATION,
    variables
  );
  return data.signup;
};

export const login = async (variables: LoginVariables) => {
  const data = await graphqlClient.request<{ login: AuthResponse }>(
    LOGIN_MUTATION,
    variables
  );
  return data.login;
};

export const forgotPassword = async (email: string) => {
  const data = await graphqlClient.request<{
    forgotPassword: { success: boolean; message: string };
  }>(FORGOT_PASSWORD_MUTATION, { email });
  return data.forgotPassword;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const data = await graphqlClient.request<{
    resetPassword: { success: boolean; message: string };
  }>(RESET_PASSWORD_MUTATION, { token, newPassword });
  return data.resetPassword;
};

// Token Management
export const storeTokens = (token: string, refreshToken?: string) => {
  localStorage.setItem("accessToken", token);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Validation Helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Optional: Add more requirements
  // if (!/[A-Z]/.test(password)) {
  //   errors.push("Password must contain at least one uppercase letter");
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push("Password must contain at least one number");
  // }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username: string): {
  isValid: boolean;
  error?: string;
} => {
  if (username.length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters" };
  }
  if (username.length > 20) {
    return { isValid: false, error: "Username must be less than 20 characters" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      error: "Username can only contain letters, numbers, and underscores",
    };
  }
  return { isValid: true };
};

// Error Message Formatter
export const formatAuthError = (error: Error): string => {
  const message = error.message.toLowerCase();

  if (message.includes("user already exists") || message.includes("duplicate")) {
    return "An account with this username or email already exists.";
  }
  if (message.includes("invalid credentials") || message.includes("incorrect")) {
    return "Invalid username or password.";
  }
  if (message.includes("network") || message.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }
  if (message.includes("not found")) {
    return "Account not found.";
  }

  return error.message || "An unexpected error occurred. Please try again.";
};