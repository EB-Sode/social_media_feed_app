"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { mapPostToUI } from "@/lib/mappers/post.mapper";
import PostCard from "@/components/feed/PostCard";
import { ArrowLeft, Settings, UserPlus, UserMinus } from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const {
    user,
    posts,
    followStats,
    loading,
    error,
    followUser,
    unfollowUser,
    deletePost,
  } = useProfile(userId);

  const [isFollowLoading, setIsFollowLoading] = useState(false);

  /**
   * Handle follow/unfollow action
   */
  const handleFollowToggle = async () => {
    if (!followStats) return;
    
    setIsFollowLoading(true);
    try {
      if (followStats.isFollowing) {
        await unfollowUser();
      } else {
        await followUser();
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  /**
   * Handle post deletion
   */
  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <p>Loading profile...</p>
        </div>
        <style jsx>{`
          .profile-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
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

  if (error || !user) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <p>{error || "User not found"}</p>
        </div>
        <style jsx>{`
          .profile-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
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
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <button className="back-btn" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </button>
        <h1>{user.username}</h1>
        <button className="settings-btn">
          <Settings size={24} />
        </button>
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        <div className="avatar-section">
          <div className="avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.username} />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
        </div>

        <div className="stats-section">
          <div className="stat">
            <span className="stat-value">{posts.length}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat">
            <span className="stat-value">{followStats?.followersCount || 0}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat">
            <span className="stat-value">{followStats?.followingCount || 0}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>

        <div className="bio-section">
          <h2 className="display-name">{user.username}</h2>
          {user.bio && <p className="bio">{user.bio}</p>}
        </div>

        {/* Action Buttons */}
        {followStats && (
          <div className="action-buttons">
            <button
              className={`follow-btn ${followStats.isFollowing ? "following" : ""}`}
              onClick={handleFollowToggle}
              disabled={isFollowLoading}
            >
              {followStats.isFollowing ? (
                <>
                  <UserMinus size={18} />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Follow
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className="posts-section">
        <h3 className="section-title">Posts</h3>
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={mapPostToUI(post)}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
        }

        .profile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          margin-bottom: 24px;
        }

        .profile-header h1 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .back-btn,
        .settings-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .back-btn:hover,
        .settings-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .profile-info {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .avatar-section {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2b8761, #1f6949);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-weight: 700;
          overflow: hidden;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .stats-section {
          display: flex;
          justify-content: space-around;
          padding: 20px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }

        .bio-section {
          padding: 20px 0;
        }

        .display-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .bio {
          font-size: 14px;
          line-height: 1.5;
          color: #374151;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .follow-btn {
          flex: 1;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          background: #2b8761;
          color: white;
        }

        .follow-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .follow-btn.following {
          background: #e5e7eb;
          color: #1f2937;
        }

        .follow-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .posts-section {
          margin-top: 24px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .posts-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}