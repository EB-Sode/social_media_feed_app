/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import { 
  GET_FEED, 
  LIKE_POST_MUTATION,
  DELETE_POST_MUTATION 
} from "@/lib/queries";
import type { Post } from "@/lib/queries";
import { useToast } from "@/components/providers/ToastProvider";

export function useFeed(options?: { autoFetch?: boolean }) {

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
    if (options?.autoFetch !== false) fetchFeed();
  }, [fetchFeed, options?.autoFetch]);


  /** Create a new post */
  const createPost = async (content?: string, imageFile?: File) => {
  if (!content && !imageFile) {
    showToast("Post must have content or image", "error");
    throw new Error("Post must have content or image");
  }

  if (content && content.length > 100) {
    showToast("Post content too long (max 100 chars)", "error");
    throw new Error("Content exceeds 100 characters");
  }

  const graphqlUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const token = localStorage.getItem("accessToken");

  if (!token) {
    showToast("You must be logged in", "error");
    throw new Error("No auth token");
  }

  try {
    /** IMAGE POST */
    if (imageFile) {
      const formData = new FormData();

      const query = `
        mutation CreatePost($content: String!, $image: Upload) {
          createPost(content: $content, image: $image) {
            post {
              id
              content
              imageUrl
              createdAt
              updatedAt
              likesCount
              commentsCount
              isLikedByUser
              author {
                id
                username
                profileImage
              }
            }
          }
        }
      `;

      formData.append(
        "operations",
        JSON.stringify({
          query,
          variables: { content: content || "", image: null },
        })
      );

      formData.append("map", JSON.stringify({ "0": ["variables.image"] }));
      formData.append("0", imageFile);

      const res = await fetch(graphqlUrl, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Upload failed (${res.status})`);
      }

      const data = await res.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const post = data.data.createPost.post;
      setPosts((prev) => [post, ...prev]);
      showToast("Post created successfully!", "success");
      return post;
    }

    /** TEXT-ONLY POST */
    const textOnlyMutation = `
      mutation CreatePost($content: String!) {
        createPost(content: $content) {
          post {
            id
            content
            imageUrl
            createdAt
            updatedAt
            likesCount
            commentsCount
            isLikedByUser
            author {
              id
              username
              profileImage
            }
          }
        }
      }
    `;

    const res = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: textOnlyMutation,
        variables: { content },
      }),
    });

    if (!res.ok) {
      throw new Error(`Post failed (${res.status})`);
    }

    const data = await res.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const post = data.data.createPost.post;
    setPosts((prev) => [post, ...prev]);
    showToast("Post created successfully!", "success");
    return post;
  } catch (err: any) {
    console.error("Failed to create post:", err);
    showToast(err.message || "Failed to create post", "error");
    throw err;
  }
};


  /** Like/unlike a post */
  const likePost = async (postId: string) => {
    // optimistic update (optional but nice)
    const prevPosts = posts;

    try {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                // toggle UI immediately
                isLikedByUser: !p.isLikedByUser,
                likesCount: p.likesCount + (p.isLikedByUser ? -1 : 1),
              }
            : p
        )
      );

      const client = getAuthenticatedClient();

      const res = await client.request<{
        likePost: {
          success: boolean;
          message: string;
          post: { id: string; likesCount: number; commentsCount: number };
        };
      }>(LIKE_POST_MUTATION, { postId });

      const { post, message } = res.likePost;

      // infer liked from message (since backend doesn't return liked boolean)
      const likedNow = message === "Post liked";

      // sync UI with server truth
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likesCount: post.likesCount,
                commentsCount: post.commentsCount,
                isLikedByUser: likedNow,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to like post:", err);
      setPosts(prevPosts); // rollback
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