"use client";

import React from "react";
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
}

export default function Settings({ onClose }: SettingsProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  const settingsSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit profile", onClick: onClose },
        { icon: Shield, label: "security", onClick: () => {} },
        { icon: Bell, label: "Notifications", onClick: () => {} },
        { icon: Lock, label: "Privacy", onClick: () => {} },
      ],
    },
    {
      title: "Support & About",
      items: [
        { icon: CreditCard, label: "My Subscription", onClick: () => {} },
        { icon: HelpCircle, label: "Help & Support", onClick: () => {} },
        { icon: FileText, label: "Terms and Policies", onClick: () => {} },
      ],
    },
    {
      title: "Cache & cellular",
      items: [
        { icon: Trash2, label: "Free up space", onClick: () => {} },
        { icon: Save, label: "Data Saver", onClick: () => {} },
      ],
    },
    {
      title: "Actions",
      items: [
        { icon: Flag, label: "Report a problem", onClick: () => {} },
        { icon: UserPlus, label: "Add account", onClick: () => {} },
        { icon: LogOut, label: "Log out", onClick: handleLogout },
      ],
    },
  ];

  return (
    <div className="settings-overlay">
      <div className="settings-container">
        {/* Header */}
        <header className="settings-header">
          <button className="back-button" onClick={onClose} aria-label="Back">
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
          <h1 className="settings-title">Settings</h1>
        </header>

        {/* Settings List */}
        <div className="settings-content">
          {settingsSections.map((section, index) => (
            <div key={index} className="settings-section">
              <h2 className="section-title">{section.title}</h2>
              <div className="settings-items">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      className="settings-item"
                      onClick={item.onClick}
                    >
                      <div className="item-left">
                        <div className="item-icon">
                          <Icon size={20} strokeWidth={2} />
                        </div>
                        <span className="item-label">{item.label}</span>
                      </div>
                      <ChevronRight size={20} strokeWidth={2} className="chevron" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #b1f5bf;
          z-index: 100;
          overflow-y: auto;
        }

        .settings-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          min-height: 100vh;
          background: #b1f5bf;
        }

        .settings-header {
          background: #b1f5bf;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .back-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #1f2937;
          cursor: pointer;
          border-radius: 10px;
          transition: background 0.2s ease;
        }

        .back-button:hover {
          background: rgba(31, 41, 55, 0.1);
        }

        .settings-title {
          font-family: "Poppins", sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
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
          color: #1f2937;
          margin: 0 0 16px 0;
        }

        .settings-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .settings-item {
          width: 100%;
          background: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .settings-item:hover {
          background: #f9fafb;
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
          background: rgba(43, 135, 97, 0.1);
          border-radius: 8px;
          color: #2b8761;
        }

        .item-label {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #1f2937;
        }

        .chevron {
          color: #9ca3af;
          flex-shrink: 0;
        }

        /* Special styling for logout */
        .settings-section:last-child .settings-item:last-child .item-icon {
          background: rgba(239, 68, 68, 0.1);
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