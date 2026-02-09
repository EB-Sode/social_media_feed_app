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
import ProfileSidebar from "@/components/profile/Sidebar";
import EditProfile from "@/components/profile/EditProfile";
import { MapPin, UserPlus, UserMinus } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"photos" | "likes">("photos");
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

  /**
   * Handle profile save from EditProfile
   * Backend supports: bio, email, profileImage (as URL)
   * Backend does NOT support: username, location, coverImage
   */
  const handleProfileSave = async (updated: {
    username?: string;
    email?: string;
    location?: string;
    profileImage?: File;
    coverImage?: File;
  }) => {
    try {
      // Prepare the update
      const updateData: {
        bio?: string;
        email?: string;
        profileImage?: string;
      } = {};

      // Email is supported
      if (updated.email) {
        updateData.email = updated.email;
      }

      // Bio - keep existing if not in the form
      if (user?.bio) {
        updateData.bio = user.bio;
      }

      // For profileImage, you'd need to upload to Cloudinary/S3 first
      // Then pass the URL to the mutation
      // For now, we'll skip file upload
      // TODO: Implement image upload to Cloudinary
      // if (updated.profileImage) {
      //   const imageUrl = await uploadToCloudinary(updated.profileImage);
      //   updateData.profileImage = imageUrl;
      // }

      // Call the mutation
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
          {/* Cover */}
          <div className="cover-row">
            <img
              src={user.coverImage || "/api/placeholder/800/300"}
              alt="Cover"
              className="cover-img"
            />
          </div>

          <div className="body-row">
            {/* LEFT */}
            <div className="left-col">
              <svg
                className="blob-svg"
                viewBox="0 0 460 120"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M0,0 L460,0 L460,120 Q380,60 260,100 Q160,130 0,80 Z"
                  fill="#b1f5bf"
                />
              </svg>

              <div className="left-inner">
                <ProfileSidebar
                  firstPostId={posts?.[0]?.id}
                  hasPosts={!!posts?.length}
                  onOpenSettings={() => setShowSettings(true)}
                  homeHref="/feed"
                />

                {/* Avatar */}
                <div className="avatar-ring">
                  <img
                    src={user.profileImage || "/api/placeholder/150/150"}
                    alt={user.username}
                    className="avatar-img"
                  />
                </div>

                <h1 className="username">{user.username}</h1>
                <p className="role">{user.bio || "No bio yet"}</p>

                <p className="location">
                  <MapPin size={15} />
                  {user.location || user.email || "—"}
                </p>

                <div className="stats-row">
                  <div className="stat">
                    <span className="stat-num">
                      {followStats?.followersCount ?? 0}
                    </span>
                    <span className="stat-lbl">followers</span>
                  </div>
                  <div className="stat">
                    <span className="stat-num">
                      {followStats?.followingCount ?? 0}
                    </span>
                    <span className="stat-lbl">following</span>
                  </div>
                  <div className="stat">
                    <span className="stat-num">{posts.length}</span>
                    <span className="stat-lbl">posts</span>
                  </div>
                </div>

                {isMe ? (
                  <button
                    className="edit-btn"
                    onClick={() => setShowEditProfile(true)}
                  >
                    Edit profile
                  </button>
                ) : (
                  <button
                    className={`follow-btn ${
                      followStats?.isFollowing ? "following" : ""
                    }`}
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
            </div>

            {/* RIGHT */}
            <div className="right-col">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === "photos" ? "active" : ""}`}
                  onClick={() => setActiveTab("photos")}
                >
                  Photos
                </button>
                <button
                  className={`tab ${activeTab === "likes" ? "active" : ""}`}
                  onClick={() => setActiveTab("likes")}
                >
                  Likes
                </button>
              </div>

              {activeTab === "photos" ? (
                <div className="photo-grid">
                  {posts.length === 0 ? (
                    <div className="empty">No posts yet</div>
                  ) : (
                    posts.map((p: any) => (
                      <Link key={p.id} href={`/post/${p.id}`} className="photo-cell">
                        <img
                          src={p.image || "/api/placeholder/300/300"}
                          alt=""
                        />
                      </Link>
                    ))
                  )}
                </div>
              ) : (
                <div className="empty">No liked posts yet</div>
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
          }

          .profile-wrapper {
            width: 100%;
            min-height: calc(100vh - 56px);
            background: #b1f5bf;
          }

          .profile-main {
            width: 100%;
          }

          .cover-row {
            width: 100%;
            height: 240px;
            overflow: hidden;
          }
          .cover-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .body-row {
            display: flex;
            min-height: 460px;
          }

          .left-col {
            width: 420px;
            min-width: 420px;
            background: #b1f5bf;
            position: relative;
            overflow: hidden;
          }

          .blob-svg {
            position: absolute;
            top: -100px;
            left: 0;
            width: 100%;
            height: 120px;
          }

          .left-inner {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 24px 24px 32px;
          }

          .avatar-ring {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            background: linear-gradient(135deg, #a8e6cf, #dceefb);
            padding: 6px;
            margin-top: 8px;
          }

          .avatar-img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #fff;
          }

          .username {
            font-family: "Poppins", sans-serif;
            font-size: 22px;
            font-weight: 700;
            color: #1f2937;
            margin: 14px 0 2px;
            text-align: center;
            text-transform: lowercase;
          }

          .role {
            font-family: "Inter", sans-serif;
            font-size: 14px;
            color: #6b7280;
            margin: 0 0 6px;
            text-align: center;
          }

          .location {
            font-family: "Inter", sans-serif;
            font-size: 13px;
            color: #6b7280;
            margin: 0 0 20px;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .location :global(svg) {
            color: #1f2937;
          }

          .stats-row {
            display: flex;
            gap: 24px;
            margin-bottom: 20px;
          }

          .stat {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .stat-num {
            font-family: "Poppins", sans-serif;
            font-size: 26px;
            font-weight: 700;
            color: #1f2937;
            line-height: 1;
          }

          .stat-lbl {
            font-family: "Inter", sans-serif;
            font-size: 12px;
            color: #6b7280;
            margin-top: 3px;
          }

          .edit-btn,
          .follow-btn {
            background: #2b8761;
            color: #fff;
            border: none;
            padding: 11px 36px;
            border-radius: 10px;
            font-family: "Poppins", sans-serif;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .edit-btn:hover,
          .follow-btn:hover {
            background: #1f6949;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(43, 135, 97, 0.3);
          }

          .follow-btn.following {
            background: rgba(43, 135, 97, 0.2);
            color: #1f2937;
          }

          .follow-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .right-col {
            flex: 1;
            background: #b1f5bf;
            display: flex;
            flex-direction: column;
          }

          .tabs {
            display: flex;
            justify-content: center;
            gap: 40px;
            padding: 20px 12px 12px;
            border-bottom: 2px solid rgba(0, 0, 0, 0.08);
          }

          .tab {
            background: none;
            border: none;
            font-family: "Inter", sans-serif;
            font-size: 16px;
            font-weight: 600;
            color: #9ca3af;
            cursor: pointer;
            padding-bottom: 8px;
            position: relative;
            transition: color 0.2s;
          }

          .tab:hover {
            color: #6b7280;
          }

          .tab.active {
            color: #1f2937;
          }

          .tab.active::after {
            content: "";
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: #1f2937;
            border-radius: 2px;
          }

          .photo-grid {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
            padding: 8px;
            align-content: start;
          }

          .photo-cell {
            aspect-ratio: 1;
            border-radius: 10px;
            overflow: hidden;
            background: #d1d5db;
            cursor: pointer;
            transition: opacity 0.2s;
            display: block;
          }

          .photo-cell:hover {
            opacity: 0.85;
          }

          .photo-cell img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .empty {
            grid-column: 1 / -1;
            text-align: center;
            color: #64748b;
            padding: 40px;
          }

          @media (max-width: 860px) {
            .body-row {
              flex-direction: column;
            }
            .left-col {
              width: 100%;
              min-width: unset;
            }
            .blob-svg {
              display: none;
            }
          }
        `}</style>
      </div>
    </>
  );
}