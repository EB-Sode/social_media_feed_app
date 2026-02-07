"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import {
  CREATE_POST_MUTATION,
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
      const { post } = await client.request<{ post: Post }>(
        GET_POST_BY_ID,
        { postId }
      );

      setPost(post);
      // Extract comments if they're included in the post
      if (post.comments) {
        setComments(post.comments);
      }
    } catch (err) {
      console.error("Failed to load post:", err);
      setError("Failed to load post");
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

    // Store previous state for rollback
    const previousLikesCount = post.likesCount;
    const previousIsLiked = post.isLikedByUser;

    try {
      // Optimistic update
      setPost({
        ...post,
        isLikedByUser: !post.isLikedByUser,
        likesCount: post.isLikedByUser 
          ? post.likesCount - 1 
          : post.likesCount + 1,
      });

      const client = getAuthenticatedClient();
      const { likePost } = await client.request<{
        likePost: {
          liked: boolean;
          post: { id: string; likesCount: number; commentsCount: number };
        };
      }>(LIKE_POST_MUTATION, { postId });

      // Update with server response
      setPost((prev) =>
        prev
          ? {
              ...prev,
              likesCount: likePost.post.likesCount,
              isLikedByUser: likePost.liked,
            }
          : null
      );
    } catch (err) {
      console.error("Failed to like post:", err);
      // Rollback on error
      if (post) {
        setPost({
          ...post,
          likesCount: previousLikesCount,
          isLikedByUser: previousIsLiked,
        });
      }
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