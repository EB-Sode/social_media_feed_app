"use client";

import React from "react";
// import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Lock,
  CreditCard,
  HelpCircle,
  FileText,
  Trash2,
  Save,
  Flag,
  UserPlus,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { clearTokens } from "@/lib/auth-utils";

interface SettingsProps {
  onClose: () => void;
  onEditProfile: () => void; // ✅ NEW
}

export default function Settings({ onClose, onEditProfile }: SettingsProps) {
  const router = useRouter();
  const go = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };
  const handleFreeUpSpace = () => {
    // clears local-only caches you control
    localStorage.removeItem("feedCache");
    localStorage.removeItem("usersCache");
    // you can add more keys as you introduce caching
    alert("Freed up space (local cache cleared).");
  };
  const handleDataSaver = () => {
    const current = localStorage.getItem("dataSaver") === "true";
    localStorage.setItem("dataSaver", (!current).toString());
    alert(`Data Saver: ${!current ? "ON" : "OFF"}`);
  };

  const handleReportProblem = () => {
    onClose();
    // simplest: go to a report page
    router.push("/settings/report");
  };

  const handleAddAccount = () => {
    onClose();
    // simplest: go to login (or account switcher page later)
    router.push("/login");
  };

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Edit profile",
          onClick: () => {
            onClose();        // close settings
            onEditProfile(); // open edit profile
          },
        },
        { icon: Shield, label: "Security", onClick: () => go("/settings/security") },
        { icon: Bell, label: "Notifications", onClick: () => go("/notifications") },
        { icon: Lock, label: "Privacy", onClick: () => go("/settings/privacy") },
      ],
    },
    {
      title: "Support & About",
      items: [
        { icon: CreditCard, label: "My Subscription", onClick: () => go("/settings/subscription") },
        { icon: HelpCircle, label: "Help & Support", onClick: () => go("/settings/help") },
        { icon: FileText, label: "Terms and Policies", onClick: () => go("/settings/terms") },
      ],
    },
    {
      title: "Cache & cellular",
      items: [
        { icon: Trash2, label: "Free up space", onClick: handleFreeUpSpace },
        { icon: Save, label: "Data Saver", onClick: handleDataSaver },
      ],
    },
    {
      title: "Actions",
      items: [
        { icon: Flag, label: "Report a problem", onClick: handleReportProblem },
        { icon: UserPlus, label: "Add account", onClick: handleAddAccount },
        { icon: LogOut, label: "Log out", onClick: handleLogout },
      ],
    },
  ];

  return (
    <div className="settings-overlay">
      <div className="settings-container">
        {/* Header */}
        <header className="settings-header">
          <button className="back-button" onClick={onClose}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="settings-title">Settings</h1>
        </header>

        {/* Content */}
        <div className="settings-content">
          {settingsSections.map((section, i) => (
            <div key={i} className="settings-section">
              <h2 className="section-title">{section.title}</h2>
              {section.items.map((item, j) => {
                const Icon = item.icon;
                return (
                  <button
                    key={j}
                    className="settings-item"
                    onClick={item.onClick}
                  >
                    <div className="item-left">
                      <div className="item-icon">
                        <Icon size={20} />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={20} />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .settings-overlay {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 999999;
          background: var(--bg);
          overflow-y: auto;
        }

        .settings-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          min-height: 100vh;
          background: var(--bg);
        }

        .settings-header {
          background: var(--bg);
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid var(--border);
        }

        .back-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text);
          cursor: pointer;
          border-radius: 10px;
          transition: background 0.2s ease;
        }

        .back-button:hover {
          background: var(--hover);
        }

        .settings-title {
          font-family: "Poppins", sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .settings-content {
          padding: 24px;
        }

        .settings-section {
          margin-bottom: 32px;
        }

        .settings-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-family: "Poppins", sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 16px 0;
        }

        .settings-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .settings-item {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .settings-item:hover {
          background: var(--surface-2);
          transform: translateX(4px);
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .item-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(43, 135, 97, 0.12);
          border-radius: 8px;
          color: var(--brand);
        }

        html.dark .item-icon {
          background: rgba(43, 135, 97, 0.18);
        }

        .item-label {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
        }

        .chevron {
          color: var(--muted);
          flex-shrink: 0;
        }

        /* Special styling for logout */
        .settings-section:last-child .settings-item:last-child .item-icon {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
        }

        .settings-section:last-child .settings-item:last-child .item-label {
          color: #ef4444;
        }

        @media (max-width: 480px) {
          .settings-header {
            padding: 16px 16px;
          }

          .settings-title {
            font-size: 20px;
          }

          .settings-content {
            padding: 20px 16px;
          }
        }
      `}</style>

    </div>
  );
}