/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import { 
  GET_FEED, 
  CREATE_POST_MUTATION, 
  LIKE_POST_MUTATION,
  DELETE_POST_MUTATION 
} from "@/lib/queries";
import type { Post } from "@/lib/queries";
import { useToast } from "@/components/providers/ToastProvider";

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  /** Fetch feed posts from API */
  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = getAuthenticatedClient();
      const { feed } = await client.request<{ feed: Post[] }>(GET_FEED);
      setPosts(feed);
    } catch (err) {
      console.error("Failed to load feed:", err);
      setError("Failed to load feed");
      showToast("Failed to load feed", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  /** Create a new post */
const createPost = async (content?: string, imageBase64?: string) => {
  if (!content && !imageBase64) {
    showToast("Post must have content or image", "error");
    throw new Error("Post must have content or image");
  }

  try {
    const client = getAuthenticatedClient();

    const { createPost } = await client.request<{
      createPost: { post: Post };
    }>(CREATE_POST_MUTATION, {
      content: content || "",
      image: imageBase64 || null,
    });

    setPosts((prev) => [createPost.post, ...prev]);
    showToast("Post created successfully!", "success");
    return createPost.post;
  } catch (err: any) {
    console.error("Failed to create post:", err);
    showToast("Failed to create post", "error");
    throw err;
  }
};


  /** Like/unlike a post */
  const likePost = async (postId: string) => {
    try {
      const client = getAuthenticatedClient();
      const { likePost } = await client.request<{
        likePost: {
          liked: boolean;
          post: { id: string; likesCount: number; commentsCount: number };
        };
      }>(LIKE_POST_MUTATION, { postId });

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likesCount: likePost.post.likesCount,
                isLikedByUser: likePost.liked,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to like post:", err);
      showToast("Failed to like post", "error");
      throw err;
    }
  };

  /** Delete a post */
  const deletePost = async (postId: string) => {
    const previousPosts = [...posts];

    try {
      setPosts((prev) => prev.filter((p) => p.id !== postId));

      const client = getAuthenticatedClient();
      await client.request(DELETE_POST_MUTATION, { postId });

      showToast("Post deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete post:", err);
      setPosts(previousPosts);
      showToast("Failed to delete post", "error");
      throw err;
    }
  };

  return {
    posts,
    setPosts,
    loading,
    error,
    refetch: fetchFeed,
    createPost,
    likePost,
    deletePost,
  };
}
