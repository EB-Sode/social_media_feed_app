"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Settings as SettingsIcon } from "lucide-react";

type ProfileSidebarProps = {
  /** route user to first post when clicked */
  firstPostId?: string;
  /** disable messages button when no post */
  hasPosts?: boolean;
  /** open settings overlay in parent */
  onOpenSettings: () => void;
  /** optional: route home */
  homeHref?: string; // default: "/feed"
};

export default function ProfileSidebar({
  firstPostId,
  hasPosts = true,
  onOpenSettings,
  homeHref = "/feed",
}: ProfileSidebarProps) {
  const router = useRouter();

  return (
    <div className="sidebar-nav">
      {/* HOME */}
      <button
        className="nav-icon"
        aria-label="Home"
        onClick={() => router.push(homeHref)}
        type="button"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>

      {/* SETTINGS → overlay */}
      <button
        className="nav-icon"
        aria-label="Settings"
        onClick={onOpenSettings}
        type="button"
      >
        <SettingsIcon size={22} strokeWidth={2} />
      </button>

      {/* PROFILE (stays) */}
      <button className="nav-icon" aria-label="Profile" type="button">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      <style jsx>{`
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
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }

        .nav-icon:hover {
          color: #2b8761;
          background: rgba(43, 135, 97, 0.08);
        }

        .nav-icon:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          background: none;
        }

        @media (max-width: 860px) {
          .sidebar-nav {
            position: relative;
            left: unset;
            top: unset;
            flex-direction: row;
            justify-content: center;
            margin-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
}
