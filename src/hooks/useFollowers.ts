/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useFollowersList.ts
"use client";

import { useEffect, useState } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import { GET_FOLLOWERS, GET_FOLLOWING } from "@/lib/queries";

type MiniUser = {
  id: string;
  username: string;
  profileImage?: string | null;
  bio?: string | null;
};

export function useFollowersList(
  userId: string | undefined,
  mode: "followers" | "following",
  refreshKey: number = 0
) {
  const [users, setUsers] = useState<MiniUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!userId) {
        setUsers([]);
        setError("Missing userId");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const client = getAuthenticatedClient();

        if (mode === "followers") {
          const res = await client.request<{
            followers: { follower: MiniUser }[];
          }>(GET_FOLLOWERS, { userId });

          if (cancelled) return;
          setUsers((res.followers ?? []).map((x) => x.follower));
        } else {
          const res = await client.request<{
            following: { followed: MiniUser }[];
          }>(GET_FOLLOWING, { userId });

          if (cancelled) return;
          setUsers((res.following ?? []).map((x) => x.followed));
        }
      } catch (e: any) {
        if (cancelled) return;
        console.error("FollowersList error:", e);
        setError(e?.message || "Failed to load list");
        setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [userId, mode, refreshKey]);

  return { users, loading, error };
}
