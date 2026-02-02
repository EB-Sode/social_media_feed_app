"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { graphqlClient } from "@/lib/graphql";
import {
  AuthFormProps,
  SignupFormFields,
  LoginFormFields,
  SignupResponse,
  LoginResponse,
} from "./types";

export default function AuthForm({ mode, redirectTo }: AuthFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🔑 REQUIRED
    setError("");
    setLoading(true);

    try {
      if (!username || !password || (mode === "signup" && !email)) {
        throw new Error("Please fill in all required fields.");
      }

      if (mode === "signup") {
        const mutation = `
          mutation Signup($username: String!, $email: String!, $password: String!, $bio: String) {
            signup(username: $username, email: $email, password: $password, bio: $bio) {
              user { id username email }
              token
              refreshToken
            }
          }
        `;

        const variables: SignupFormFields = { username, email, password, bio };
        const data: SignupResponse = await graphqlClient.request(mutation, variables);

        localStorage.setItem("accessToken", data.signup.token);
        localStorage.setItem("refreshToken", data.signup.refreshToken);
      } else {
        const mutation = `
          mutation Login($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              user { id username email }
              token
            }
          }
        `;

        const variables: LoginFormFields = { username, password };
        const data: LoginResponse = await graphqlClient.request(mutation, variables);

        localStorage.setItem("accessToken", data.login.token);
      }

      router.push(redirectTo ?? "/feed");
    } catch (err) {
      if (err instanceof Error) {
        console.error("❌ GraphQL error:", err);
        // Show the actual error from the server if available
        setError(err.message || "Network error - please check your connection");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {mode === "signup" && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Bio (optional)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </>
      )}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : mode === "signup" ? "Sign Up" : "Login"}
      </button>
    </form>
  );
}
