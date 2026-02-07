"use client";
// (main)/feed/page.tsx
import FeedList from "@/components/feed/FeedList";
import { useAuth } from "@/context/AuthContext"; // example

export default function FeedPage() {
  const { user } = useAuth();

  return <FeedList currentUser={user || undefined} />;
}
