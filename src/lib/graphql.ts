// src/lib/graphql.ts
import { GraphQLClient } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is missing. Set it to https://.../graphql/ (or /graphql)"
  );
}

// Ensure endpoint ends with ONE trailing slash
const ENDPOINT = API_URL.endsWith("/") ? API_URL : `${API_URL}/`;

/**
 * Create a GraphQL client instance with optional authentication.
 * NOTE: Do NOT force Content-Type for file uploads (multipart/form-data).
 * graphql-request only uses JSON requests, so this is fine here.
 */
export function createGraphQLClient(token?: string | null): GraphQLClient {
  const headers: Record<string, string> = {};

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return new GraphQLClient(ENDPOINT, { headers });
}

/**
 * Get the current access token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

/**
 * Get the current refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

/**
 * Save tokens to localStorage
 */
export function saveTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
}

/**
 * Clear all tokens from localStorage
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

/**
 * Get an authenticated GraphQL client (uses token from localStorage)
 */
export function getAuthenticatedClient(): GraphQLClient {
  return createGraphQLClient(getAccessToken());
}

/**
 * Get an unauthenticated GraphQL client (for login/signup)
 */
export function getUnauthenticatedClient(): GraphQLClient {
  return createGraphQLClient(null);
}

/**
 * ✅ Export real client INSTANCES (not functions)
 * - publicClient: for login/signup
 * - authClient: for queries that require token (creates client using latest token)
 *
 * IMPORTANT:
 *  authClient must be a function because the token can change after login.
 */
export const publicClient = getUnauthenticatedClient();
export const authClient = () => getAuthenticatedClient();

export const graphqlClient = publicClient;

export const ME_QUERY = `
  query Me {
    me {
      id
      username
      email
      bio
      location
      profileImage
      coverImage
      createdAt
      followersCount
      followingCount
      postsCount
    }
  }
`;

