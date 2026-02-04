"use client";

import { graphqlClient } from "@/lib/graphql";
import { useRouter } from "next/navigation";

interface SignupButtonProps {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

export default function SignupButton({ username, email, password, bio = "" }: SignupButtonProps) {
  const router = useRouter();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      alert("Username, email, and password are required");
      return;
    }

    const mutation = `
      mutation Signup($username: String!, $email: String!, $password: String!, $bio: String) {
        signup(username: $username, email: $email, password: $password, bio: $bio) {
          user { id username email bio }
          token
          refreshToken
        }
      }
    `;

    try {
      const data = await graphqlClient.request(mutation, { username, email, password, bio });

      const { user, token, refreshToken } = data.signup;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("Signed up user:", user);

      router.push("/feed");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Check console.");
    }
  };

  return <button onClick={handleSignup}>Sign Up</button>;
}
