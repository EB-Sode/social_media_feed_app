"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import {
  GET_USER_POSTS,
  GET_FOLLOW_STATS,
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
  UPDATE_PROFILE_MUTATION,
  DELETE_POST_MUTATION, // UPDATED: Import the mutation
  type User,
  type Post,
  type FollowStats,
} from "@/lib/queries";

interface UpdateProfileVariables {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string; // UPDATED: Changed from profileImage to match mutation
}

/**
 * Hook for managing user profile data and actions
 * UPDATED: Removed unused second parameter
 * @param userId - The ID of the user whose profile to load
 */
export function useProfile(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followStats, setFollowStats] = useState<FollowStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all profile data (posts and follow stats)
   * UPDATED: Memoized with useCallback for consistency
   */
  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = getAuthenticatedClient();

      // Fetch posts and follow stats in parallel
      // UPDATED: Use Promise.all for better performance
      const [postsResponse, statsResponse] = await Promise.all([
        client.request<{ userPosts: Post[] }>(GET_USER_POSTS, { userId }),
        client.request<{ followStats: FollowStats }>(GET_FOLLOW_STATS, { userId }),
      ]);

      setPosts(postsResponse.userPosts);
      setFollowStats(statsResponse.followStats);
      
      // Extract user from first post if available
      if (postsResponse.userPosts.length > 0) {
        setUser(postsResponse.userPosts[0].author);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // UPDATED: Simplified effect
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /**
   * Follow a user
   * UPDATED: Added optimistic updates and error rollback
   */
  const followUser = async () => {
    if (!userId || !followStats) return;

    // Store previous state for rollback
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
      console.error("Follow user error:", err);
      // Rollback on error
      setFollowStats(previousStats);
      throw err;
    }
  };

  /**
   * Unfollow a user
   * UPDATED: Added optimistic updates and error rollback
   */
  const unfollowUser = async () => {
    if (!userId || !followStats) return;

    // Store previous state for rollback
    const previousStats = { ...followStats };

    try {
      // Optimistic update
      setFollowStats({
        ...followStats,
        isFollowing: false,
        followersCount: followStats.followersCount - 1,
      });

      const client = getAuthenticatedClient();
      await client.request(UNFOLLOW_USER_MUTATION, { userId });
    } catch (err) {
      console.error("Unfollow user error:", err);
      // Rollback on error
      setFollowStats(previousStats);
      throw err;
    }
  };

  /**
   * Update user profile
   * UPDATED: Fixed mutation response type
   * @param variables - Profile fields to update
   */
  const updateProfile = async (variables: UpdateProfileVariables) => {
    if (!user) return;

    try {
      const client = getAuthenticatedClient();
      const { updateProfile } = await client.request<{ 
        updateProfile: { user: User } 
      }>(UPDATE_PROFILE_MUTATION, variables);

      // UPDATED: Access nested user object
      setUser(updateProfile.user);
      return updateProfile.user;
    } catch (err) {
      console.error("Update profile error:", err);
      throw err;
    }
  };

  /**
   * Delete a post from the profile
   * UPDATED: Now uses DELETE_POST_MUTATION
   * @param postId - ID of the post to delete
   */
  const deletePost = async (postId: string) => {
    // Store previous state for rollback
    const previousPosts = [...posts];

    try {
      // Optimistically remove from UI
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      
      // UPDATED: Call the actual mutation
      const client = getAuthenticatedClient();
      await client.request(DELETE_POST_MUTATION, { postId });
    } catch (err) {
      console.error("Failed to delete post:", err);
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
    refetch: loadProfile, // UPDATED: Now properly memoized
    followUser,
    unfollowUser,
    updateProfile,
    deletePost, // UPDATED: Added delete functionality
  };
}