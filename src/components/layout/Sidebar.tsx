/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, Search, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotificationsLive } from "@/hooks/useNotifications";
import Image from "next/image";


import { imgSrc } from "@/lib/image";
import Settings from "@/components/profile/Settings";
import EditProfile from "@/components/profile/EditProfile";


export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

const { unreadCount, loading: notificationsLoading } = useNotificationsLive();
const notificationCount = isAuthenticated && !notificationsLoading ? unreadCount : 0;


  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const profileLink = user?.id ? `/profile/${user.id}` : "/login";
  // const postlink = isAuthenticated ? `/post/${user?.id}` : "/login";

  const handleEditProfile = () => {
    setSettingsOpen(false);
    setEditProfileOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = settingsOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [settingsOpen]);

  const handleSaveProfile = async (data: {
    username?: string;
    email?: string;
    location?: string;
    profileImage?: File;
    coverImage?: File;
  }) => {
    // ✅ TODO: call your GraphQL update profile mutation here.
    // For now: log + close (so your UI flow works immediately)
    console.log("Saving profile:", data);

    // If you already have a function to refetch/update user in context, call it here.

    setEditProfileOpen(false);
  };


  return (
    <>
      <nav className="sidebar">
        <div className="logo-container">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <Image
                src="/RB.png"
                alt="App logo"
                width={60}
                height={60}
                priority
              />
          </div>
        </div>

        <div className="nav-items">
          <Link href={profileLink} className="nav-item" aria-label="Profile">
            <div className="profile-avatar">
              <img
                src={imgSrc(user?.profileImage)}
                alt={user?.username ?? "User"}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
          </Link>

          <Link
            href="/feed"
            className={`nav-item ${isActive("/feed") ? "active" : ""}`}
            aria-label="Home"
          >
            <Home size={24} strokeWidth={2} />
          </Link>

          <Link
            href="/notifications"
            className={`nav-item ${isActive("/notifications") ? "active" : ""}`}
            aria-label="Notifications"
          >
            <div className="notification-wrapper">
              <Bell size={24} strokeWidth={2} />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </div>
          </Link>

          <Link
            href="/search"
            className={`nav-item ${isActive("/search") ? "active" : ""}`}
            aria-label="Search"
          >
            <Search size={24} strokeWidth={2} />
          </Link>
        </div>

        <div className="nav-footer">
          <button
            type="button"
            className={`nav-item ${settingsOpen ? "active" : ""}`}
            aria-label="Menu"
            onClick={() => setSettingsOpen(true)}
          >
            <Menu size={24} strokeWidth={2} />
          </button>
        </div>
        {settingsOpen && (
          <div
            className="settings-overlay"
            role="dialog"
            aria-modal="true"
            onClick={() => setSettingsOpen(false)} // click outside to close
          >
            <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
              {/* ✅ Close Button */}
              <button
                className="close-btn"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
              >
                <X size={20} />
              </button>
              <Settings
                onClose={() => setSettingsOpen(false)}
                onEditProfile={handleEditProfile}
              />
            </div>
          </div>
        )}

        <style jsx>{`
          .sidebar {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
            height: 100%;
          }
          .logo-container {
            margin-bottom: 40px;
          }
          .logo {
            width: 48px;
            height: 48px;
            background: #1f2937;
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Poppins", sans-serif;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          .logo:hover {
            transform: scale(1.05);
          }
          .nav-items {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 24px;
            align-items: center;
          }
          .nav-item {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #1f2937;
            transition: all 0.2s ease;
            border-radius: 12px;
            cursor: pointer;
            position: relative;
            border: none;
            background: transparent;
          }
          .nav-item:hover {
            background: rgba(31, 41, 55, 0.1);
            transform: scale(1.05);
          }
          .nav-item.active {
            background: rgba(31, 41, 55, 0.15);
          }
          .nav-item :global(svg) {
            color: currentColor;
          }
          .notification-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .notification-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            background: #ef4444;
            color: white;
            font-family: "Inter", sans-serif;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 5px;
            border-radius: 10px;
            min-width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
          }
          .nav-footer {
            margin-top: auto;
            padding-bottom: 40px;
          }
          .profile-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid #1f2937;
            transition: transform 0.2s ease;
            cursor: pointer;
          }
          .profile-avatar:hover {
            transform: scale(1.05);
          }

          .settings-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.25); /* dim background */
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 24px;
          overflow-y: auto;
        }

        .settings-panel {
          width: 100%;
          max-width: 820px;
          background: #b1f5bf; /* or white if you want */
          border-radius: 20px;
        }

        .close-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: none;
        background: white;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
      }

      .close-btn:hover {
        background: #f3f4f6;
        transform: scale(1.05);
      }
        `}</style>
      </nav>
 {/* ✅ SETTINGS MODAL */}
      {settingsOpen && (
        <Settings
          onClose={() => setSettingsOpen(false)}
          onEditProfile={handleEditProfile}
        />
      )}

      {/* ✅ EDIT PROFILE MODAL */}
      {editProfileOpen && (
        <EditProfile
          user={{
            username: user?.username ?? undefined,
            email: user?.email ?? undefined,
            location: user?.location ?? undefined,
            profileImage: user?.profileImage ?? undefined,
            coverImage: user?.coverImage ?? undefined,
          }}
          onClose={() => setEditProfileOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
}
