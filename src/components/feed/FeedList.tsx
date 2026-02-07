/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import PostCard from "./PostCard";
import PostCreateModal from "@/components/modals/PostCreateModal";
import { Plus, Heart, Send } from "lucide-react";
import { useFeed } from "@/hooks/useFeed";
import { mapPostToUI } from "@/lib/mappers/post.mapper";


// UPDATED: You'll need to get the current user data
// This could come from a useAuth hook or context
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

  /**
   * Handle creating a post via the modal
   */
  const handleCreatePost = async (content: string, imageFile?: File) => {
    let imageData: string | undefined;
    if (imageFile) {
      imageData = await fileToBase64(imageFile);
    }
    await createPost(content, imageData);
  };

  /**
   * Convert File to base64 string
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  /**
   * Handle liking a post
   */
  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (err) {
      console.error("Failed to like post:", err);
      // Could show a toast notification here
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
        <header className="feed-header">
          <div className="header-left">
            <h1 className="app-name">Social</h1>
          </div>

          <div className="header-actions">
            <button className="header-btn" aria-label="Liked posts">
              <Heart size={24} />
            </button>
            <button className="header-btn" aria-label="Messages">
              <Send size={24} />
            </button>
            <button
              className="header-btn"
              onClick={() => setIsCreateModalOpen(true)}
              aria-label="Create post"
            >
              <Plus size={24} />
            </button>
          </div>
        </header>

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
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={mapPostToUI(post)} 
                onLike={handleLikePost} 
              />
            ))
          )}
        </div>

        <style jsx>{`
          .feed-wrapper {
            width: 100%;
            min-height: 100vh;
          }

          .feed-header {
            background: white;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 10;
          }

          .header-left {
            display: flex;
            align-items: center;
          }

          .app-name {
            font-family: 'Poppins', sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
          }

          .header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .header-btn {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            color: #1f2937;
            cursor: pointer;
            border-radius: 8px;
            transition: background 0.2s ease;
          }

          .header-btn:hover:not(:disabled) {
            background: rgba(31, 41, 55, 0.1);
          }

          .header-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .header-btn :global(svg) {
            color: currentColor;
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

      {/* Create Post Modal */}
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