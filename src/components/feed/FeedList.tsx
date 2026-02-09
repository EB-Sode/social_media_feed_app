"use client";

import React, { useState } from "react";
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
  const { posts, loading, error, createPost, likePost } = useFeed();
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

  if (loading) {
    return (
      <div className="feed-wrapper">
        <div className="loading-state">
          <p>Loading feed...</p>
        </div>
        <style jsx>{`
          .feed-wrapper {
            width: 100%;
            min-height: 100vh;
          }
          .loading-state {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 50vh;
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-wrapper">
        <div className="error-state">
          <p>{error}</p>
        </div>
        <style jsx>{`
          .feed-wrapper {
            width: 100%;
            min-height: 100vh;
          }
          .error-state {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 50vh;
            color: #ef4444;
          }
        `}</style>
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
                  onLike={handleLikePost}
                />
              );
            })
          )}
        </div>

        <style jsx>{`
          .feed-wrapper {
            width: 100%;
            min-height: 100vh;
          }

          .posts-container {
            padding: 20px 0;
            display: flex;
            flex-direction: column;
            gap: 24px;
            max-width: 500px;
            margin: 0 auto;
          }

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            color: #6b7280;
            text-align: center;
            gap: 16px;
          }

          .create-first-post-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: #2b8761;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }

          .create-first-post-btn:hover {
            background: #1f6949;
          }
        `}</style>
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
