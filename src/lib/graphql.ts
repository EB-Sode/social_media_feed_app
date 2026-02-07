import { GraphQLClient } from 'graphql-request';
import { gql } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Create a GraphQL client instance with authentication
 */
export function createGraphQLClient(token?: string | null): GraphQLClient {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return new GraphQLClient(API_URL, {
    headers,
  });
}

/**
 * Get the current access token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

/**
 * Get the current refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

/**
 * Save tokens to localStorage
 */
export function saveTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

/**
 * Clear all tokens from localStorage
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/**
 * Get an authenticated GraphQL client (uses token from localStorage)
 */
export function getAuthenticatedClient(): GraphQLClient {
  const token = getAccessToken();
  return createGraphQLClient(token);
}

/**
 * Get an unauthenticated GraphQL client (for login/signup)
 */
export function getUnauthenticatedClient(): GraphQLClient {
  return createGraphQLClient();
}

// Export the default client for backward compatibility
export const graphqlClient = getAuthenticatedClient();


export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      bio
    }
  }
`;
