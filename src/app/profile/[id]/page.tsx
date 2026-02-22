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
  const { user: currentUser, refreshMe } = useAuth();

  const {
    user,
    posts,
    followStats,
    loading,
    error,
    deleteAllPosts,
    createPostWithImage,
    followUser,
    unfollowUser,
    updateProfile,
    updateUserImages,
    refetch,
  } = useProfile(userId);

  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"photos" | "posts" | "likes">("posts");
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const isMe = currentUser?.id === userId;
  const likedFromThisProfile = posts.filter((p: any) => p.isLikedByUser);

  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      await createPostWithImage({ content: "", image: file });
      setActiveTab("posts");
      // optional: refetch() if your create mutation doesn't return full post
      // await refetch();
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

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
      await updateProfile({
        email: updated.email,
        bio: user?.bio ?? undefined,
        location: updated.location ?? undefined,
      });

      await updateUserImages({
        profile: updated.profileImage,
        cover: updated.coverImage,
      });

      await Promise.all([refetch(), refreshMe()]);

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

  const photoPosts = posts.filter((p: any) => !!p.imageUrl);

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

            <svg className="blob-overlay" viewBox="0 0 1200 400" preserveAspectRatio="none">
              <path
                d="M0,350 Q200,250 400,300 Q600,350 800,280 Q1000,210 1200,280 L1200,400 L0,400 Z"
                fill="#70D686"
              />
            </svg>
          </div>

          <div className="content-section">
            <div className="left-sidebar">
              <ProfileSidebar
                firstPostId={posts?.[0]?.id}
                hasPosts={!!posts?.length}
                onOpenSettings={() => setShowSettings(true)}
                homeHref="/feed"
              />
            </div>

            <div className="profile-info">
              <div className="avatar-container">
                <img src={imgSrc(user.profileImage)} alt={user.username} className="avatar-img" />
              </div>

              <h1 className="profile-name">{user.username}</h1>
              <p className="profile-role">{user.bio || "Interior designer"}</p>

              <p className="profile-location">
                <MapPin size={18} strokeWidth={2} />
                {user.location || "Lagos, Nigeria"}
              </p>

              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-value">{followStats?.followersCount ?? 0}</div>
                  <div className="stat-label">followers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{followStats?.followingCount ?? 0}</div>
                  <div className="stat-label">following</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{posts.length}</div>
                  <div className="stat-label">posts</div>
                </div>
              </div>

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

            <div className="photos-section">
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
                  onClick={() => {
                    setActiveTab("likes");
                  }}
                >
                  Likes
                </button>
              </div>

              {/* CONTENT */}
              {activeTab === "photos" ? (
                                <>
                  {isMe && (
                    <div className="toolbar">
                      <label className="action-btn mini" style={{ cursor: "pointer" }}>
                        {uploading ? "Uploading..." : "Upload Photo"}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(file);
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {/* <div className="photos-grid">
                    {photoPosts.length === 0 ? (
                      <div className="empty-state">No photos yet</div>
                    ) : (
                      photoPosts.map((p: any) => (
                        <Link key={p.id} href={`/post/${p.id}`} className="photo-item">
                          <img src={imgSrc(p.imageUrl, "")} alt="" />
                        </Link>
                      ))
                    )}
                  </div> */}
                  <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridAutoRows: "200px",
                    gap: "4px",
                    padding: "4px",
                  }}
                >
                  {photoPosts.map((p: any) => (
                    <Link
                      key={p.id}
                      href={`/post/${p.id}`}
                      style={{
                        position: "relative",
                        display: "block",
                        height: "200px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <img
                        src={imgSrc(p.imageUrl, "")}
                        alt=""
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Link>
                  ))}
                </div>
                </>

              ) : activeTab === "posts" ? (
                <div className="posts-list">
                  {isMe && posts.length > 0 && (
                    <div className="toolbar right">
                      <button
                        className="action-btn danger mini"
                        onClick={async () => {
                          const ok = confirm("Delete ALL your posts? This cannot be undone.");
                          if (!ok) return;
                          try {
                            await deleteAllPosts();
                          } catch (e) {
                            console.error(e);
                            alert("Failed to delete posts");
                          }
                        }}
                      >
                        Delete all posts
                      </button>
                    </div>
                  )}

                  {posts.length === 0 ? (
                    <div className="empty-state">No posts yet</div>
                  ) : (
                    posts.map((p: any) => (
                      <Link key={p.id} href={`/post/${p.id}`} className="post-row">
                        {p.imageUrl ? (
                          <div className="post-thumb">
                            <img src={imgSrc(p.imageUrl, "")} alt="" />
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
                    <div className="posts-list">
                      {likedFromThisProfile.length === 0 ? (
                        <div className="empty-state">No liked posts here yet</div>
                      ) : (
                        likedFromThisProfile.map((p: any) => (
                          <Link key={p.id} href={`/post/${p.id}`} className="post-row">
                            {p.imageUrl ? (
                              <div className="post-thumb">
                                <img src={imgSrc(p.imageUrl, "")} alt="" />
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
              bio: user.bio ?? "",
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
            color: var(--text);
          }

          .profile-wrapper {
            width: 100%;
            min-height: 100vh;
            background: linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%);
            color: var(--text);
          }

          .profile-main {
            width: 100%;
            position: relative;
          }

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

          .content-section {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 16px;

            display: grid;
            grid-template-columns: 80px minmax(280px, 420px) 1fr;
            gap: 24px;

            background: var(--surface);
            min-height: calc(100vh - 340px);
            position: relative;
            border-top: 1px solid var(--border);
          }

          .left-sidebar {
            padding: 40px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-right: 2px solid var(--border)
          }

          .profile-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 24px 40px;
          }

          .avatar-container {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 6px solid var(--brand);
            margin-top: -100px;
            margin-bottom: 20px;
            overflow: hidden;
            background: var(--surface);
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
            color: var(--brand);
            margin: 0 0 8px 0;
            text-align: center;
          }

          .profile-role {
            font-family: "Inter", sans-serif;
            font-size: 16px;
            font-weight: 500;
            color: var(--text);
            margin: 0 0 12px 0;
            text-align: center;
          }

          .profile-location {
            font-family: "Inter", sans-serif;
            font-size: 15px;
            font-weight: 500;
            color: var(--text);
            margin: 0 0 32px 0;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .profile-location :global(svg) {
            color: var(--text);
          }

          .stats-container {
            display: flex;
            gap: 40px;
            margin-bottom: 32px;
            flex-wrap: wrap;
            justify-content: center;
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
            color: var(--brand);
            line-height: 1;
            margin-bottom: 4px;
          }

          .stat-label {
            font-family: "Inter", sans-serif;
            font-size: 13px;
            font-weight: 500;
            color: var(--text);
            opacity: 0.9;
          }

          .action-btn {
            background: var(--brand);
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
            background: var(--brand-2);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(43, 135, 97, 0.3);
          }

          .action-btn.following {
            background: rgba(43, 135, 97, 0.18);
            color: var(--brand);
            border: 1px solid rgba(43, 135, 97, 0.25);
          }

          html.dark .action-btn.following {
            background: rgba(43, 135, 97, 0.22);
            border: 1px solid rgba(43, 135, 97, 0.3);
          }

          .action-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .action-btn.mini {
            padding: 10px 14px;
            font-size: 13px;
          }

          .action-btn.danger {
            background: #ef4444;
          }

          .photos-section {
            background: var(--bg);
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid var(--border);
          }

          .tabs-container {
            display: flex;
            justify-content: center;
            gap: 60px;
            padding: 28px 0 20px;
            border-bottom: 2px solid rgba(43, 135, 97, 0.18);
          }

          html.dark .tabs-container {
            border-bottom: 2px solid rgba(43, 135, 97, 0.22);
          }

          .tab-btn {
            background: none;
            border: none;
            font-family: "Poppins", sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: var(--muted);
            cursor: pointer;
            padding-bottom: 12px;
            position: relative;
            transition: color 0.2s ease;
          }

          .tab-btn:hover {
            color: var(--text);
          }

          .tab-btn.active {
            color: var(--brand);
          }

          .tab-btn.active::after {
            content: "";
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--brand);
            border-radius: 2px;
          }

          .toolbar {
            padding: 12px 24px;
            display: flex;
            justify-content: flex-start;
          }

          .photos-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 200px; /* ← fixed row height, all cells equal */
            gap: 4px;
            padding: 4px;
          }

          .photo-item {
            position: relative;
            width: 100%;
            height: 100%; /* ← fills the fixed grid row */
            border-radius: 8px;
            overflow: hidden;
            background: var(--surface-2);
            border: 1px solid var(--border);
            display: block;
            min-width: 0;
          }

          .photo-item img {
            position: absolute !important;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center;
            display: block;
          }

          .photo-item:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 20px var(--shadow);
          }

          .empty-state {
            text-align: center;
            color: var(--muted);
            padding: 80px 20px;
            font-family: "Inter", sans-serif;
            font-size: 16px;
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
            border: 1px solid rgba(43, 135, 97, 0.18);
            border-radius: 16px;
            padding: 12px;
            text-decoration: none;
            color: inherit;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }

          html.dark .post-row {
            background: rgba(15, 23, 42, 0.55);
            border: 1px solid rgba(43, 135, 97, 0.25);
          }

          .post-row:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 18px var(--shadow);
          }

          .post-thumb {
            width: 64px;
            height: 64px;
            border-radius: 12px;
            overflow: hidden;
            flex-shrink: 0;
            background: var(--surface-2);
            border: 1px solid var(--border);
          }

          .post-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .post-thumb.placeholder {
            background: linear-gradient(
              135deg,
              rgba(43, 135, 97, 0.2),
              rgba(31, 105, 73, 0.15)
            );
          }

          .post-body {
            flex: 1;
            min-width: 0;
          }

          .post-text {
            margin: 0 0 6px 0;
            font-family: "Inter", sans-serif;
            font-size: 14px;
            color: var(--text);
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
            color: var(--muted);
          }

          @media (max-width: 1024px) {
            .content-section {
              grid-template-columns: 1fr;
              gap: 16px;
              padding: 0 14px;
            }

            .left-sidebar {
              padding: 14px 0;
              flex-direction: row;
              justify-content: center;
            }

            .profile-info {
              max-width: 640px;
              margin: 0 auto;
            }

            .photos-grid {
              grid-template-columns: repeat(2, 1fr);
            }
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

            .content-section {
              padding: 0 12px;
            }

            .photos-section {
              border-radius: 16px;
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
              gap: 8px;
              padding: 16px;
            }

            .action-btn {
              padding: 12px 18px;
              font-size: 14px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
