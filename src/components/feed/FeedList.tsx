"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "./PostCard";
import PostCreateModal from "@/components/modals/PostCreateModal";
import { Plus } from "lucide-react";
import { useFeed } from "@/hooks/useFeed";
import { mapPostToUI, type UIPost } from "@/lib/mappers/post.mapper";

interface FeedListProps {
  currentUser?: {
    id: string;
    username: string;
    profileImage?: string | null;
  };
}


export default function FeedList({ currentUser }: FeedListProps) {
  const router = useRouter();

  // ✅ make sure your hook exposes deletePost + updatePost (or editPost)
  const { posts, loading, error, createPost, likePost, deletePost } = useFeed();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreatePost = async (content: string, imageFile?: File) => {
    await createPost(content, imageFile);
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      // optionally show toast
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleEditPost = (postId: string) => {
    router.push(`/post/${postId}/edit`);

    // OR open an edit modal you already have:
    // setEditTarget(postId) ...
  };

  if (loading) {
    return (
      <div className="feed-wrapper">
        <div className="loading-state">
          <p>Loading feed...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-wrapper">
        <div className="error-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="feed-wrapper">
        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet. Create your first post!</p>
              <button
                className="create-first-post-btn"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={20} />
                Create Post
              </button>
            </div>
          ) : (
            posts.map((post) => {
              const uiPost: UIPost = mapPostToUI(post);
              return (
                <PostCard
                  key={post.id}
                  post={uiPost}
                  currentUserId={currentUser?.id}
                  onLike={handleLikePost}
                  onDelete={handleDeletePost}
                  onEdit={handleEditPost}
                />
              );
            })
          )}
        </div>
      </div>

      {currentUser && (
        <PostCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePost}
          userAvatar={currentUser.profileImage}
          username={currentUser.username}
        />
      )}
    </>
  );
}
