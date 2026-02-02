"use client";

import { graphqlClient } from "@/lib/graphql";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const username = searchParams.get("username") ?? "";
  const email = searchParams.get("email") ?? "";
  const password = searchParams.get("password") ?? "";
  const bio = searchParams.get("bio") ?? "";    

const handleSignup = async () => {
    if (!username || !email || !password) {
      alert("Username, email, and password are required");
      return;
    }
  
    const mutation = `
      mutation Signup($username: String!, $email: String!, $password: String!, $bio: String) {
        signup(username: $username, email: $email, password: $password, bio: $bio) {
          user { id username email }
          token
          refreshToken
        }
      }
    `;

    const variables = { username, email, password, bio };


    try {
      const data = await graphqlClient.request(mutation, variables);

      // Store tokens
      localStorage.setItem("accessToken", data.signup.token);
      localStorage.setItem("refreshToken", data.signup.refreshToken);

      console.log("Signed up user:", data.signup.user);

      router.push("/feed"); // Redirect to feed after signup
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Check console for details.");
    }
  };
  
  return (
    <button onClick={handleSignup}>Sign Up</button>
  );
}
