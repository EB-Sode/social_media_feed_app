"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import {
  GET_POST_BY_ID,
  LIKE_POST_MUTATION,
  CREATE_COMMENT_MUTATION,
  type Post,
  type Comment,
} from "@/lib/queries";

/**
 * Hook for managing a single post and its comments
 * Used on individual post detail pages
 * 
 * @param postId - The ID of the post to load
 */
export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load post data from API
   */
  const loadPost = useCallback(async () => {
    if (!postId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = getAuthenticatedClient();

      const data = await client.request<{
        post: Post;
        comments: Comment[];
      }>(GET_POST_BY_ID, { postId });

      setPost(data.post);
      setComments(data.comments ?? []);
    } catch (err) {
      console.error("Failed to load post:", err);
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  /**
   * Like or unlike the post
   */
  const likePost = async () => {
    if (!post) return;

    const previousLikesCount = post.likesCount;
    const previousIsLiked = post.isLikedByUser;

    try {
      // optimistic update
      setPost({
        ...post,
        isLikedByUser: !post.isLikedByUser,
        likesCount: post.isLikedByUser ? post.likesCount - 1 : post.likesCount + 1,
      });

      const client = getAuthenticatedClient();

      const res = await client.request<{
        likePost: {
          success: boolean;
          message: string;
          post: { id: string; likesCount: number; commentsCount: number; isLikedByUser?: boolean };
        };
      }>(LIKE_POST_MUTATION, { postId });

      const serverPost = res.likePost.post;

      // derive liked status from message (since backend doesn’t return liked boolean)
      const likedNow = res.likePost.message === "Post liked";

      setPost((prev) =>
        prev
          ? {
              ...prev,
              likesCount: serverPost.likesCount,
              commentsCount: serverPost.commentsCount,
              isLikedByUser: likedNow,
            }
          : null
      );
    } catch (err) {
      console.error("Failed to like post:", err);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              likesCount: previousLikesCount,
              isLikedByUser: previousIsLiked,
            }
          : prev
      );
      throw err;
    }
  };

  /**
   * Create a comment on the post
   * @param content - Comment text content
   */
  const createComment = async (content: string) => {
    if (!post || !content.trim()) return;

    try {
      const client = getAuthenticatedClient();
      const { createComment } = await client.request<{
        createComment: { comment: Comment };
      }>(CREATE_COMMENT_MUTATION, { postId, content });

      // Add new comment to the list
      setComments((prev) => [...prev, createComment.comment]);

      // Update post comment count
      setPost((prev) =>
        prev
          ? { ...prev, commentsCount: prev.commentsCount + 1 }
          : null
      );

      return createComment.comment;
    } catch (err) {
      console.error("Failed to create comment:", err);
      throw err;
    }
  };

  return {
    post,
    comments,
    loading,
    error,
    refetch: loadPost,
    likePost,
    createComment,
  };
}