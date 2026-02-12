/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import {
  GET_ALL_USERS,
  SEARCH_USERS,
  GET_FOLLOW_STATS,
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
} from "@/lib/queries";

type GqlUser = {
  id: string;
  username: string;
  bio?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
  location?: string | null;
};

type FollowStats = {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isFollowed_by: boolean;
};

export type DirectoryUser = GqlUser & {
  followStats?: FollowStats;
};

export function useUsersDirectory(searchQuery?: string, currentUserId?: string) {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const client = useMemo(() => getAuthenticatedClient(), []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const trimmed = (searchQuery || "").trim();

      // 1) fetch list (all vs search)
      let baseUsers: GqlUser[] = [];

      if (trimmed) {
        const res = await client.request<{ searchUsers: GqlUser[] }>(
          SEARCH_USERS,
          { query: trimmed }
        );
        baseUsers = res.searchUsers ?? [];
      } else {
        const res = await client.request<{ users: GqlUser[] }>(GET_ALL_USERS);
        baseUsers = res.users ?? [];
      }

      // optional: remove yourself from list
      if (currentUserId) {
        baseUsers = baseUsers.filter((u) => u.id !== currentUserId);
      }

      // 2) fetch follow_stats per user (simple + correct)
      const statsResults = await Promise.all(
        baseUsers.map(async (u) => {
          try {
            const statsRes = await client.request<{ followStats: FollowStats }>(
              GET_FOLLOW_STATS,
              { userId: u.id }
            );
            return { userId: u.id, stats: statsRes.followStats };
          } catch {
            return { userId: u.id, stats: undefined };
          }
        })

      );

      const statsMap = new Map(statsResults.map((x) => [x.userId, x.stats]));

      setUsers(
        baseUsers.map((u) => ({
          ...u,
          followStats: statsMap.get(u.id),
        }))
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [client, searchQuery, currentUserId]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const follow = useCallback(
    async (userId: string) => {
        try {
            await client.request(FOLLOW_USER_MUTATION, { userId });
            } catch (e: any) {
            console.error("Follow error message:", e?.message);
            console.error("Follow error response:", e?.response); // <-- IMPORTANT
            throw e;
            }
      // optimistic
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId || !u.followStats) return u;
          return {
            ...u,
            followStats: {
              ...u.followStats,
              isFollowing: true,
              followersCount: u.followStats.followersCount + 1,
            },
          };
        })
      );

      try {
        await client.request(FOLLOW_USER_MUTATION, { userId });
      } catch {
        // revert by refetch
        loadUsers();
      }
    },
    [client, loadUsers]
  );

  const unfollow = useCallback(
    async (userId: string) => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId || !u.followStats) return u;
          return {
            ...u,
            followStats: {
              ...u.followStats,
              is_following: false,
              followersCount: Math.max(0, u.followStats.followersCount - 1),
            },
          };
        })
      );

      try {
        await client.request(UNFOLLOW_USER_MUTATION, { userId });
      } catch {
        loadUsers();
      }
    },
    [client, loadUsers]
  );

  return { users, loading, error, refetch: loadUsers, follow, unfollow };
}
