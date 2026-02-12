/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/context/AuthContext";
import Settings from "@/components/profile/Settings";
import ProfileSidebar from "@/components/profile/ProSidebar";
import EditProfile from "@/components/profile/EditProfile";
import { MapPin, UserPlus, UserMinus } from "lucide-react";
import { imgSrc } from "@/lib/image";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { user: currentUser } = useAuth();

  const {
    user,
    posts,
    followStats,
    loading,
    error,
    followUser,
    unfollowUser,
    updateProfile,
  } = useProfile(userId);

  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"photos" | "posts" | "likes">("posts");
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const isMe = currentUser?.id === userId;

  const handleFollowToggle = async () => {
    if (!followStats) return;

    setIsFollowLoading(true);
    try {
      if (followStats.isFollowing) await unfollowUser();
      else await followUser();
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleProfileSave = async (updated: {
    username?: string;
    email?: string;
    location?: string;
    profileImage?: File;
    coverImage?: File;
  }) => {
    try {
      const updateData: {
        bio?: string;
        email?: string;
        profileImage?: string;
      } = {};

      if (updated.email) {
        updateData.email = updated.email;
      }

      if (user?.bio) {
        updateData.bio = user.bio;
      }

      await updateProfile(updateData);

      setShowEditProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile. Please try again.");
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <p className="state">Loading profile...</p>
      </>
    );

  if (error || !user)
    return (
      <>
        <Header />
        <p className="state">{error || "User not found"}</p>
      </>
    );

  return (
    <>
      <Header />

      <div className="profile-wrapper">
        <div className="profile-main">
          {/* Cover Image */}
          <div className="cover-section">
            <img
              src={imgSrc(user.coverImage, "/default-cover.png")}
              alt="Cover"
              className="cover-img"
            />
            
            {/* Green blob overlay */}
            <svg className="blob-overlay" viewBox="0 0 1200 400" preserveAspectRatio="none">
              <path
                d="M0,350 Q200,250 400,300 Q600,350 800,280 Q1000,210 1200,280 L1200,400 L0,400 Z"
                fill="#70D686"
              />
            </svg>
          </div>

          {/* Content Section */}
          <div className="content-section">
            {/* Left Sidebar */}
            <div className="left-sidebar">
              <ProfileSidebar
                firstPostId={posts?.[0]?.id}
                hasPosts={!!posts?.length}
                onOpenSettings={() => setShowSettings(true)}
                homeHref="/feed"
              />
            </div>

            {/* Profile Info */}
            <div className="profile-info">
              {/* Avatar */}
              <div className="avatar-container">
                <img
                  src={imgSrc(user.profileImage)}
                  alt={user.username}
                  className="avatar-img"
                />
              </div>

              {/* Name & Bio */}
              <h1 className="profile-name">{user.username}</h1>
              <p className="profile-role">{user.bio || "Interior designer"}</p>

              {/* Location */}
              <p className="profile-location">
                <MapPin size={18} strokeWidth={2} />
                {user.location || "Lagos, Nigeria"}
              </p>

              {/* Stats */}
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-value">{followStats?.followersCount ?? 122}</div>
                  <div className="stat-label">followers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{followStats?.followingCount ?? 67}</div>
                  <div className="stat-label">following</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{posts.length > 0 ? posts.length : "37K"}</div>
                  <div className="stat-label">likes</div>
                </div>
              </div>

              {/* Edit/Follow Button */}
              {isMe ? (
                <button className="action-btn" onClick={() => setShowEditProfile(true)}>
                  Edit profile
                </button>
              ) : (
                <button
                  className={`action-btn ${followStats?.isFollowing ? "following" : ""}`}
                  disabled={isFollowLoading}
                  onClick={handleFollowToggle}
                >
                  {followStats?.isFollowing ? (
                    <>
                      <UserMinus size={18} /> Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} /> Follow
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Photos Grid */}
            <div className="photos-section">
              {/* Tabs */}
              <div className="tabs-container">
                <button
                  className={`tab-btn ${activeTab === "photos" ? "active" : ""}`}
                  onClick={() => setActiveTab("photos")}
                >
                  Photos
                </button>

                <button
                  className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
                  onClick={() => setActiveTab("posts")}
                >
                  Posts
                </button>

                <button
                  className={`tab-btn ${activeTab === "likes" ? "active" : ""}`}
                  onClick={() => setActiveTab("likes")}
                >
                  Likes
                </button>
              </div>


              {/* Content */}
              {activeTab === "photos" ? (
                <div className="photos-grid">
                  {posts.filter((p: any) => !!p.image).length === 0 ? (
                    <div className="empty-state">No photos yet</div>
                  ) : (
                    posts
                      .filter((p: any) => !!p.image)
                      .map((p: any) => (
                        <Link key={p.id} href={`/post/${p.id}`} className="photo-item">
                          <img src={imgSrc(p.image, "")} alt="" />
                        </Link>
                      ))
                  )}
                </div>
              ) : activeTab === "posts" ? (
                <div className="posts-list">
                  {posts.length === 0 ? (
                    <div className="empty-state">No posts yet</div>
                  ) : (
                    posts.map((p: any) => (
                      <Link key={p.id} href={`/post/${p.id}`} className="post-row">
                        {p.image ? (
                          <div className="post-thumb">
                            <img src={imgSrc(p.image, "")} alt="" />
                          </div>
                        ) : (
                          <div className="post-thumb placeholder" />
                        )}

                        <div className="post-body">
                          <p className="post-text">{p.content || "No text"}</p>
                          <p className="post-meta">
                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              ) : (
                <div className="empty-state">No liked posts yet</div>
              )}

            </div>
          </div>
        </div>

        {showSettings && (
          <Settings
            onClose={() => setShowSettings(false)}
            onEditProfile={() => {
              setShowSettings(false);
              setShowEditProfile(true);
            }}
          />
        )}

        {showEditProfile && (
          <EditProfile
            user={{
              username: user.username ?? "",
              email: user.email ?? "",
              location: user.location ?? "",
              profileImage: user.profileImage ?? undefined,
              coverImage: user.coverImage ?? undefined,
            }}
            onClose={() => setShowEditProfile(false)}
            onSave={handleProfileSave}
          />
        )}

        <style jsx>{`
          .state {
            padding: 40px;
            text-align: center;
            font-family: "Inter", sans-serif;
          }

          .profile-wrapper {
            width: 100%;
            min-height: 100vh;
            background: #b1f5bf;
          }

          .profile-main {
            width: 100%;
            position: relative;
          }

          /* ===== COVER SECTION ===== */
          .cover-section {
            position: relative;
            width: 100%;
            height: 340px;
          }

          .cover-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .blob-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 200px;
            pointer-events: none;
          }

          /* ===== CONTENT SECTION ===== */
          .content-section {
            display: flex;
            background: #70D686;
            min-height: calc(100vh - 340px);
            position: relative;
            margin-left: 350px;
          }

          /* ===== LEFT SIDEBAR ===== */
          .left-sidebar {
            width: 80px;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          /* ===== PROFILE INFO ===== */
          .profile-info {
            width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 40px 40px;
          }

          .avatar-container {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 6px solid #2b8761;
            margin-top: -100px;
            margin-bottom: 20px;
            overflow: hidden;
            background: white;
          }

          .avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .profile-name {
            font-family: "Poppins", sans-serif;
            font-size: 32px;
            font-weight: 700;
            color: #2b8761;
            margin: 0 0 8px 0;
            text-align: center;
          }

          .profile-role {
            font-family: "Inter", sans-serif;
            font-size: 16px;
            font-weight: 500;
            color: #1f2937;
            margin: 0 0 12px 0;
            text-align: center;
          }

          .profile-location {
            font-family: "Inter", sans-serif;
            font-size: 15px;
            font-weight: 500;
            color: #1f2937;
            margin: 0 0 32px 0;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .profile-location :global(svg) {
            color: #1f2937;
          }

          /* ===== STATS ===== */
          .stats-container {
            display: flex;
            gap: 40px;
            margin-bottom: 32px;
          }

          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .stat-value {
            font-family: "Poppins", sans-serif;
            font-size: 36px;
            font-weight: 700;
            color: #2b8761;
            line-height: 1;
            margin-bottom: 4px;
          }

          .stat-label {
            font-family: "Inter", sans-serif;
            font-size: 13px;
            font-weight: 500;
            color: #1f2937;
          }

          /* ===== ACTION BUTTON ===== */
          .action-btn {
            background: #2b8761;
            color: white;
            border: none;
            padding: 14px 48px;
            border-radius: 12px;
            font-family: "Poppins", sans-serif;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .action-btn:hover {
            background: #1f6949;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(43, 135, 97, 0.3);
          }

          .action-btn.following {
            background: rgba(43, 135, 97, 0.2);
            color: #2b8761;
          }

          .action-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          /* ===== PHOTOS SECTION ===== */
          .photos-section {
            flex: 1;
            background: #b1f5bf;
            border-radius: 20px 0 0 0;
            overflow: hidden;
          }

          /* ===== TABS ===== */
          .tabs-container {
            display: flex;
            justify-content: center;
            gap: 60px;
            padding: 28px 0 20px;
            border-bottom: 2px solid rgba(43, 135, 97, 0.15);
          }

          .tab-btn {
            background: none;
            border: none;
            font-family: "Poppins", sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: #9ca3af;
            cursor: pointer;
            padding-bottom: 12px;
            position: relative;
            transition: color 0.2s ease;
          }

          .tab-btn:hover {
            color: #6b7280;
          }

          .tab-btn.active {
            color: #2b8761;
          }

          .tab-btn.active::after {
            content: "";
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 3px;
            background: #2b8761;
            border-radius: 2px;
          }

          /* ===== PHOTOS GRID ===== */
          .photos-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            padding: 24px;
          }

          .photo-item {
            aspect-ratio: 1;
            border-radius: 16px;
            overflow: hidden;
            background: #e5e7eb;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            display: block;
          }

          .photo-item:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }

          .photo-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            color: #6b7280;
            padding: 80px 20px;
            font-family: "Inter", sans-serif;
            font-size: 16px;
          }

          /* ===== RESPONSIVE ===== */
          @media (max-width: 1024px) {
            .content-section {
              flex-direction: column;
            }

            .left-sidebar {
              width: 100%;
              flex-direction: row;
              justify-content: center;
              padding: 20px;
            }

            .profile-info {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
            }

            .photos-section {
              border-radius: 20px 20px 0 0;
            }

            .photos-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          .posts-list {
              display: flex;
              flex-direction: column;
              gap: 12px;
              padding: 20px 24px;
            }

            .post-row {
              display: flex;
              gap: 12px;
              background: rgba(255, 255, 255, 0.65);
              border: 1px solid rgba(43, 135, 97, 0.15);
              border-radius: 16px;
              padding: 12px;
              text-decoration: none;
              color: inherit;
              transition: transform 0.15s ease, box-shadow 0.15s ease;
            }

            .post-row:hover {
              transform: translateY(-1px);
              box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
            }

            .post-thumb {
              width: 64px;
              height: 64px;
              border-radius: 12px;
              overflow: hidden;
              flex-shrink: 0;
              background: #e5e7eb;
            }

            .post-thumb img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .post-thumb.placeholder {
              background: linear-gradient(135deg, rgba(43, 135, 97, 0.2), rgba(31, 105, 73, 0.15));
            }

            .post-body {
              flex: 1;
              min-width: 0;
            }

            .post-text {
              margin: 0 0 6px 0;
              font-family: "Inter", sans-serif;
              font-size: 14px;
              color: #1f2937;
              line-height: 1.4;

              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .post-meta {
              margin: 0;
              font-family: "Inter", sans-serif;
              font-size: 12px;
              color: #6b7280;
            }

          @media (max-width: 640px) {
            .cover-section {
              height: 240px;
            }

            .avatar-container {
              width: 150px;
              height: 150px;
              margin-top: -75px;
            }

            .profile-name {
              font-size: 24px;
            }

            .stats-container {
              gap: 24px;
            }

            .stat-value {
              font-size: 28px;
            }

            .photos-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 8px;
              padding: 16px;
            }

          }
        `}</style>
      </div>
    </>
  );
}