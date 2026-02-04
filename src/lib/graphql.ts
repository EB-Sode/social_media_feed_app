import { GraphQLClient, RequestDocument } from "graphql-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const graphqlClient = new GraphQLClient(API_URL, {
  headers: (): Record<string, string> => {
    const headers: Record<string, string> = {};
    
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  },
});

export async function gqlRequest<T>(
  query: RequestDocument,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const data = await graphqlClient.request<T>(query, variables);
    return data;
  } catch (error) {
    console.error("GraphQL request failed:", error);
    throw error;
  }
}