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
  DELETE_ALL_USER_POSTS_MUTATION,
  UPDATE_PROFILE_MUTATION,
  UPDATE_USER_IMAGES,
  GET_LIKED_POSTS_BY_USER,
  CREATE_POST_MUTATION,
  type User,
  type Post,
  type FollowStats,
} from "@/lib/queries";

export function useProfile(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [followStats, setFollowStats] = useState<FollowStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [likesLoading, setLikesLoading] = useState(false);
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

  const loadLikedPosts = useCallback(async () => {
    if (!userId) return;

    setLikesLoading(true);
    try {
      const client = getAuthenticatedClient();

      const res = await client.request<{
        likes: Array<{ id: string; post: Post | null }>;
      }>(GET_LIKED_POSTS_BY_USER, { userId });

      const postsFromLikes =
        (res.likes ?? [])
          .map((l) => l.post)
          .filter(Boolean) as Post[];

      setLikedPosts(postsFromLikes);
    } catch (err) {
      console.error("Failed to load liked posts:", err);
      setLikedPosts([]);
    } finally {
      setLikesLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = async (input: {
    bio?: string;
    email?: string;
    location?: string;
    profileImage?: string;
  }) => {
    try {
      const client = getAuthenticatedClient();

      const variables: {
        bio?: string;
        email?: string;
        location?: string;
        profileImage?: string;
      } = {};

      if (input.bio !== undefined) variables.bio = input.bio;
      if (input.email !== undefined) variables.email = input.email;
      if (input.location !== undefined) variables.location = input.location;
      if (input.profileImage !== undefined) variables.profileImage = input.profileImage;

      const res = await client.request<{ updateProfile: { user: User } }>(
        UPDATE_PROFILE_MUTATION,
        variables
      );

      setUser(res.updateProfile.user);
      return res.updateProfile.user;
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
  };

  const updateUserImages = async (input: { profile?: File; cover?: File }) => {
    const profile = input.profile ?? null;
    const cover = input.cover ?? null;
    if (!profile && !cover) return null;

    const endpoint = process.env.NEXT_PUBLIC_API_URL!;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const operations = {
      query: UPDATE_USER_IMAGES,
      variables: { profile: null, cover: null },
    };

    const map: Record<string, string[]> = {};
    const form = new FormData();
    form.append("operations", JSON.stringify(operations));

    let i = 0;
    if (profile) {
      map[String(i)] = ["variables.profile"];
      form.append(String(i), profile);
      i++;
    }
    if (cover) {
      map[String(i)] = ["variables.cover"];
      form.append(String(i), cover);
      i++;
    }

    form.append("map", JSON.stringify(map));

    const res = await fetch(endpoint, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });

    const json = await res.json();

    if (!res.ok || json.errors) {
      throw new Error(json.errors?.[0]?.message ?? "Image upload failed");
    }

    const payload = json.data?.updateUserImages;
    if (!payload?.success) {
      throw new Error(payload?.message ?? "Image upload failed");
    }

    setUser((prev) =>
      prev
        ? {
            ...prev,
            profileImage: payload.profileImage ?? prev.profileImage,
            coverImage: payload.coverImage ?? prev.coverImage,
          }
        : prev
    );

    return payload;
  };

  // ✅ Create post with Upload (uses same multipart approach)
  const createPostWithImage = async (input: { content: string; image?: File }) => {
    const endpoint = process.env.NEXT_PUBLIC_API_URL!;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const operations = {
      query: CREATE_POST_MUTATION,
      variables: {
        content: input.content,
        image: null,
      },
    };

    const map: Record<string, string[]> = {};
    const form = new FormData();
    form.append("operations", JSON.stringify(operations));

    if (input.image) {
      map["0"] = ["variables.image"];
      form.append("0", input.image);
    }

    form.append("map", JSON.stringify(map));

    const res = await fetch(endpoint, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });

    const json = await res.json();

    if (!res.ok || json.errors) {
      throw new Error(json.errors?.[0]?.message ?? "Create post failed");
    }

    const createdPost = json.data?.createPost?.post;
    if (createdPost) {
      setPosts((prev) => [createdPost, ...prev]);
    }

    return createdPost as Post | null;
  };

  const followUser = async () => {
    if (!userId || !followStats) return;
    const previousStats = { ...followStats };

    try {
      setFollowStats({
        ...followStats,
        isFollowing: true,
        followersCount: followStats.followersCount + 1,
      });

      const client = getAuthenticatedClient();
      await client.request(FOLLOW_USER_MUTATION, { userId });
    } catch (err) {
      console.error(err);
      setFollowStats(previousStats);
      throw err;
    }
  };

  const unfollowUser = async () => {
    if (!userId || !followStats) return;
    const previousStats = { ...followStats };

    try {
      setFollowStats({
        ...followStats,
        isFollowing: false,
        followersCount: Math.max(0, followStats.followersCount - 1),
      });

      const client = getAuthenticatedClient();
      await client.request(UNFOLLOW_USER_MUTATION, { userId });
    } catch (err) {
      console.error(err);
      setFollowStats(previousStats);
      throw err;
    }
  };

  const deletePost = async (postId: string) => {
    const previousPosts = [...posts];

    try {
      setPosts((prev) => prev.filter((p) => p.id !== postId));

      const client = getAuthenticatedClient();
      await client.request(DELETE_POST_MUTATION, { postId });
    } catch (err) {
      console.error(err);
      setPosts(previousPosts);
      throw err;
    }
  };

  // ✅ Delete ALL posts (backend mutation exists!)
  const deleteAllPosts = async () => {
    const previousPosts = [...posts];

    try {
      setPosts([]);
      const client = getAuthenticatedClient();
      await client.request(DELETE_ALL_USER_POSTS_MUTATION);
    } catch (err) {
      console.error(err);
      setPosts(previousPosts);
      throw err;
    }
  };

  return {
    user,
    posts,
    likedPosts,
    followStats,
    loading,
    likesLoading,
    error,
    refetch: loadProfile,
    refetchLikes: loadLikedPosts,
    followUser,
    unfollowUser,
    deletePost,
    deleteAllPosts,
    updateProfile,
    updateUserImages,
    createPostWithImage,
  };
}
