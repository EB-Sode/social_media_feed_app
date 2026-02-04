"use client";

import React, { useState } from "react";
import { Settings as SettingsIcon, Plus, Heart, SlidersHorizontal, MapPin } from "lucide-react";
import EditProfile from "@/components/profile/EditProfile";
import Settings from "@/components/profile/Settings";

const PROFILE_DATA = {
  username: "Melissa peters",
  role: "Interior designer",
  location: "Lagos, Nigeria",
  avatar: "/api/placeholder/150/150",
  coverImage: "/api/placeholder/800/300",
  followers: 122,
  following: 67,
  likes: "37K",
  photos: [
    { id: "1", url: "/api/placeholder/300/300" },
    { id: "2", url: "/api/placeholder/300/300" },
    { id: "3", url: "/api/placeholder/300/300" },
    { id: "4", url: "/api/placeholder/300/300" },
    { id: "5", url: "/api/placeholder/300/300" },
    { id: "6", url: "/api/placeholder/300/300" },
  ],
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"photos" | "likes">("photos");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="profile-wrapper">
      {/* ── Main Profile ── */}
      <div className={`profile-main ${showEditProfile || showSettings ? "hidden" : ""}`}>

        {/* Header */}
        <header className="profile-header">
          <span className="app-logo">RD</span>
          <div className="header-actions">
            <button className="header-btn" aria-label="Add"><Plus size={22} strokeWidth={2} /></button>
            <button className="header-btn" aria-label="Likes"><Heart size={22} strokeWidth={2} /></button>
            <button className="header-btn" aria-label="Filter"><SlidersHorizontal size={22} strokeWidth={2} /></button>
          </div>
        </header>

        {/* Cover */}
        <div className="cover-row">
          <img src={PROFILE_DATA.coverImage} alt="Cover" className="cover-img" />
        </div>

        {/* Two-column body */}
        <div className="body-row">

          {/* LEFT – green blob with sidebar icons, avatar, user info */}
          <div className="left-col">
            {/* curved top edge is achieved via the SVG blob above the content */}
            <svg className="blob-svg" viewBox="0 0 460 120" preserveAspectRatio="none">
              <path d="M0,0 L460,0 L460,120 Q380,60 260,100 Q160,130 0,80 Z" fill="#b1f5bf"/>
            </svg>

            <div className="left-inner">
              {/* Sidebar nav icons */}
              <div className="sidebar-nav">
                <button className="nav-icon" aria-label="Home">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </button>
                <button className="nav-icon" aria-label="Messages">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
                <button className="nav-icon" aria-label="Settings" onClick={() => setShowSettings(true)}>
                  <SettingsIcon size={22} strokeWidth={2} />
                </button>
                <button className="nav-icon" aria-label="Profile">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>
              </div>

              {/* Avatar */}
              <div className="avatar-ring">
                <img src={PROFILE_DATA.avatar} alt={PROFILE_DATA.username} className="avatar-img" />
              </div>

              {/* Name / role / location */}
              <h1 className="username">{PROFILE_DATA.username}</h1>
              <p className="role">{PROFILE_DATA.role}</p>
              <p className="location">
                <MapPin size={15} strokeWidth={2} />
                {PROFILE_DATA.location}
              </p>

              {/* Stats */}
              <div className="stats-row">
                <div className="stat"><span className="stat-num">{PROFILE_DATA.followers}</span><span className="stat-lbl">followers</span></div>
                <div className="stat"><span className="stat-num">{PROFILE_DATA.following}</span><span className="stat-lbl">following</span></div>
                <div className="stat"><span className="stat-num">{PROFILE_DATA.likes}</span><span className="stat-lbl">likes</span></div>
              </div>

              {/* Edit profile button */}
              <button className="edit-btn" onClick={() => setShowEditProfile(true)}>Edit profile</button>
            </div>
          </div>

          {/* RIGHT – tabs + photo grid */}
          <div className="right-col">
            {/* Tabs */}
            <div className="tabs">
              <button className={`tab ${activeTab === "photos" ? "active" : ""}`} onClick={() => setActiveTab("photos")}>Photos</button>
              <button className={`tab ${activeTab === "likes" ? "active" : ""}`} onClick={() => setActiveTab("likes")}>Likes</button>
            </div>

            {/* Photo grid */}
            <div className="photo-grid">
              {PROFILE_DATA.photos.map((p) => (
                <div key={p.id} className="photo-cell">
                  <img src={p.url} alt={`Photo ${p.id}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Overlays ── */}
      {showEditProfile && <EditProfile onClose={() => setShowEditProfile(false)} />}
      {showSettings   && <Settings    onClose={() => setShowSettings(false)}    />}

      <style jsx>{`
        /* ─── wrapper ─── */
        .profile-wrapper {
          width: 100%;
          min-height: 100vh;
          background: #b1f5bf;
        }
        .profile-main { width: 100%; }
        .profile-main.hidden { display: none; }

        /* ─── header ─── */
        .profile-header {
          background: #fff;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(0,0,0,.08);
        }
        .app-logo {
          font-family: "Poppins", sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }
        .header-actions { display: flex; gap: 4px; }
        .header-btn {
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none;
          color: #1f2937; cursor: pointer;
          border-radius: 8px;
          transition: background .2s;
        }
        .header-btn:hover { background: rgba(0,0,0,.06); }

        /* ─── cover ─── */
        .cover-row { width: 100%; height: 240px; overflow: hidden; }
        .cover-img  { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ─── two-column body ─── */
        .body-row {
          display: flex;
          min-height: 460px;          /* tall enough for the grid */
        }

        /* ─── LEFT column ─── */
        .left-col {
          width: 420px;
          min-width: 420px;
          background: #70D686;
          position: relative;
          overflow: hidden;
        }

        /* the curved SVG blob that peeks up into / over the cover area */
        .blob-svg {
          position: absolute;
          top: -100px;           /* pull it up so curve overlaps cover */
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

        /* sidebar nav – vertical strip on the left edge */
        .sidebar-nav {
          position: absolute;
          left: 20px;
          top: 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          z-index: 3;
        }
        .nav-icon {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: none; border: none;
          color: #6b7280; cursor: pointer;
          border-radius: 8px;
          transition: color .2s, background .2s;
        }
        .nav-icon:hover { color: #2b8761; background: rgba(43,135,97,.08); }

        /* avatar */
        .avatar-ring {
          width: 130px; height: 130px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a8e6cf, #dceefb);
          padding: 6px;
          margin-top: 8px;
        }
        .avatar-img {
          width: 100%; height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #fff;
        }

        /* text */
        .username {
          font-family: "Poppins", sans-serif;
          font-size: 22px; font-weight: 700;
          color: #1f2937;
          margin: 14px 0 2px;
          text-align: center;
        }
        .role {
          font-family: "Inter", sans-serif;
          font-size: 14px; color: #6b7280;
          margin: 0 0 6px;
          text-align: center;
        }
        .location {
          font-family: "Inter", sans-serif;
          font-size: 13px; color: #6b7280;
          margin: 0 0 20px;
          display: flex; align-items: center; gap: 4px;
        }
        .location :global(svg) { color: #1f2937; }

        /* stats */
        .stats-row {
          display: flex;
          gap: 24px;
          margin-bottom: 20px;
        }
        .stat { display: flex; flex-direction: column; align-items: center; }
        .stat-num {
          font-family: "Poppins", sans-serif;
          font-size: 26px; font-weight: 700;
          color: #1f2937; line-height: 1;
        }
        .stat-lbl {
          font-family: "Inter", sans-serif;
          font-size: 12px; color: #6b7280;
          margin-top: 3px;
        }

        /* edit btn */
        .edit-btn {
          background: #2b8761; color: #fff;
          border: none;
          padding: 11px 36px;
          border-radius: 10px;
          font-family: "Poppins", sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          transition: background .2s, transform .2s, box-shadow .2s;
        }
        .edit-btn:hover {
          background: #1f6949;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(43,135,97,.3);
        }

        /* ─── RIGHT column ─── */
        .right-col {
          flex: 1;
          background: #b1f5bf;
          display: flex;
          flex-direction: column;
        }

        /* tabs */
        .tabs {
          display: flex;
          justify-content: center;
          gap: 40px;
          padding: 20px 12px 12px;
          border-bottom: 2px solid rgba(0,0,0,.08);
        }
        .tab {
          background: none; border: none;
          font-family: "Inter", sans-serif;
          font-size: 16px; font-weight: 600;
          color: #9ca3af;
          cursor: pointer;
          padding-bottom: 8px;
          position: relative;
          transition: color .2s;
        }
        .tab:hover { color: #6b7280; }
        .tab.active { color: #1f2937; }
        .tab.active::after {
          content: "";
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 2px;
          background: #1f2937;
          border-radius: 2px;
        }

        /* photo grid – 3 cols */
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
          transition: opacity .2s;
        }
        .photo-cell:hover { opacity: .85; }
        .photo-cell img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }

        /* ─── responsive ─── */
        @media (max-width: 860px) {
          .body-row { flex-direction: column; }
          .left-col { width: 100%; min-width: unset; }
          .blob-svg { display: none; }          /* curve not needed stacked */
          .sidebar-nav { position: relative; left: unset; top: unset; flex-direction: row; justify-content: center; margin-bottom: 8px; }
        }
      `}</style>
    </div>
  );
}