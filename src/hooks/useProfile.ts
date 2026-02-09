"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import {
  GET_USER_POSTS,
  GET_FOLLOW_STATS,
  GET_USER_BY_ID,
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
  DELETE_POST_MUTATION,
  UPDATE_PROFILE_MUTATION,
  type User,
  type Post,
  type FollowStats,
} from "@/lib/queries";

export function useProfile(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followStats, setFollowStats] = useState<FollowStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = getAuthenticatedClient();

      const [userRes, postsRes, statsRes] = await Promise.all([
        client.request<{ user: User | null }>(GET_USER_BY_ID, { userId }),
        client.request<{ userPosts: Post[] }>(GET_USER_POSTS, { userId }),
        client.request<{ followStats: FollowStats }>(GET_FOLLOW_STATS, { userId }),
      ]);

      if (!userRes.user) {
        setUser(null);
        setPosts([]);
        setFollowStats(statsRes.followStats ?? null);
        setError("User not found");
        return;
      }

      setPosts(postsRes.userPosts ?? []);
      setFollowStats(statsRes.followStats ?? null);
      setUser(userRes.user);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /**
   * Update profile
   * Supports: bio, email, profileImage (as URL string)
   * Does NOT support: username, location, coverImage (not in backend mutation)
   */
  const updateProfile = async (input: {
    bio?: string;
    email?: string;
    profileImage?: string;  // URL string, not File
  }) => {
    try {
      const client = getAuthenticatedClient();

      // Only send fields that are defined
      const variables: {
        bio?: string;
        email?: string;
        profileImage?: string;
      } = {};
      
      if (input.bio !== undefined) variables.bio = input.bio;
      if (input.email !== undefined) variables.email = input.email;
      if (input.profileImage !== undefined) variables.profileImage = input.profileImage;

      const res = await client.request<{ 
        updateProfile: { user: User } 
      }>(UPDATE_PROFILE_MUTATION, variables);

      // Update local state with backend response
      setUser(res.updateProfile.user);

      return res.updateProfile.user;
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
  };

  const followUser = async () => {
    if (!userId || !followStats) return;
    const previousStats = { ...followStats };

    try {
      // Optimistic update
      setFollowStats({
        ...followStats,
        isFollowing: true,
        followersCount: followStats.followersCount + 1,
      });

      const client = getAuthenticatedClient();
      await client.request(FOLLOW_USER_MUTATION, { userId });
    } catch (err) {
      console.error(err);
      // Rollback on error
      setFollowStats(previousStats);
      throw err;
    }
  };

  const unfollowUser = async () => {
    if (!userId || !followStats) return;
    const previousStats = { ...followStats };

    try {
      // Optimistic update
      setFollowStats({
        ...followStats,
        isFollowing: false,
        followersCount: Math.max(0, followStats.followersCount - 1),
      });

      const client = getAuthenticatedClient();
      await client.request(UNFOLLOW_USER_MUTATION, { userId });
    } catch (err) {
      console.error(err);
      // Rollback on error
      setFollowStats(previousStats);
      throw err;
    }
  };

  const deletePost = async (postId: string) => {
    const previousPosts = [...posts];

    try {
      // Optimistic update
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      
      const client = getAuthenticatedClient();
      await client.request(DELETE_POST_MUTATION, { postId });
    } catch (err) {
      console.error(err);
      // Rollback on error
      setPosts(previousPosts);
      throw err;
    }
  };

  return {
    user,
    posts,
    followStats,
    loading,
    error,
    refetch: loadProfile,
    followUser,
    unfollowUser,
    deletePost,
    updateProfile,
  };
}