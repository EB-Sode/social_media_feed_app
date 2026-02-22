/* eslint-disable react-hooks/set-state-in-effect */
"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Camera, Image as ImageIcon } from "lucide-react";
import { imgSrc } from "@/lib/image";

interface EditProfileProps {
  user: {
    bio: string;
    username?: string;
    email?: string;
    location?: string;
    profileImage?: string;
    coverImage?: string;
  };
  onClose: () => void;
  onSave: (data: {
    username?: string;
    email?: string;
    location?: string;
    bio?: string;
    profileImage?: File;
    coverImage?: File;
  }) => void;
}

export default function EditProfile({ user, onClose, onSave }: EditProfileProps) {
  const [username, setUsername] = useState(user.username ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [coverFile, setCoverFile] = useState<File | undefined>();

  // When user prop changes, keep form in sync (important when navigating profiles)
  useEffect(() => {
    setUsername(user.username ?? "");
    setEmail(user.email ?? "");
    setLocation(user.location ?? "");
    setBio(user.bio ?? ""); 
    setAvatarFile(undefined);
    setCoverFile(undefined);
  }, [user.username, user.email, user.location, user.bio]);

  // Create object URLs safely + cleanup
  const avatarPreview = useMemo(() => {
    if (!avatarFile) return null;
    return URL.createObjectURL(avatarFile);
  }, [avatarFile]);

  const coverPreview = useMemo(() => {
    if (!coverFile) return null;
    return URL.createObjectURL(coverFile);
  }, [coverFile]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

  const handleSave = () => {
    onSave({
      username: username.trim() || undefined,
      email: email.trim() || undefined,
      location: location.trim() || undefined,
      bio: bio.trim() || undefined,
      profileImage: avatarFile,
      coverImage: coverFile,
    });
  };

  const avatarSrc = avatarPreview || imgSrc(user.profileImage);
  const coverSrc = coverPreview || imgSrc(user.coverImage, "/default-cover.png");

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-container">
        {/* Header */}
        <header className="edit-header">
          <button className="back-button" onClick={onClose} aria-label="Back" type="button">
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
          <h1 className="edit-title">Edit Profile</h1>
        </header>

        <div className="edit-content">
          {/* Cover */}
          <div className="cover-section">
            <div className="cover-wrap">
              <img src={coverSrc} alt="Cover preview" className="cover-img" />
              <input
                type="file"
                accept="image/*"
                hidden
                id="coverUpload"
                onChange={(e) => setCoverFile(e.target.files?.[0])}
              />
              <label htmlFor="coverUpload" className="cover-btn" aria-label="Change cover">
                <ImageIcon size={18} strokeWidth={2} />
                Change cover
              </label>
            </div>
          </div>

          {/* Avatar */}
          <div className="avatar-section">
            <div className="avatar-container">
              <img src={avatarSrc} alt="Avatar preview" className="edit-avatar" />
              <input
                type="file"
                accept="image/*"
                hidden
                id="avatarUpload"
                onChange={(e) => setAvatarFile(e.target.files?.[0])}
              />
              <label htmlFor="avatarUpload" className="camera-button" aria-label="Change avatar">
                <Camera size={20} strokeWidth={2} />
              </label>
            </div>
          </div>

          {/* Form */}
          <form className="edit-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">Location</label>
              <input
                id="location"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                className="form-input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>

            <button type="button" className="save-button" onClick={handleSave}>
              Save changes
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .edit-profile-overlay {
          position: fixed;
          inset: 0;
          background: var(--bg);
          z-index: 100;
          overflow-y: auto;
        }

        .edit-profile-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          min-height: 100vh;
          background: var(--bg);
        }

        .edit-header {
          background: var(--bg);
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 2;
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
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .back-button:hover {
          background: var(--hover);
        }

        .edit-title {
          font-family: "Poppins", sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .edit-content {
          padding: 24px;
        }

        /* Cover */
        .cover-section {
          margin-bottom: 18px;
        }

        .cover-wrap {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid var(--border);
        }

        html.dark .cover-wrap {
          background: rgba(15, 23, 42, 0.55);
        }

        .cover-img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
        }

        .cover-btn {
          position: absolute;
          right: 12px;
          bottom: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(31, 41, 55, 0.9);
          color: white;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-family: "Inter", sans-serif;
          font-size: 13px;
          font-weight: 600;
        }

        /* Avatar */
        .avatar-section {
          display: flex;
          justify-content: center;
          margin: -42px 0 24px;
        }

        .avatar-container {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .edit-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--bg);
          background: var(--surface);
          display: block;
        }

        .camera-button {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          height: 40px;
          background: var(--brand);
          border: 3px solid var(--bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .camera-button:hover {
          background: var(--brand-2);
          transform: scale(1.05);
        }

        /* Form */
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          color: var(--text);
          transition: all 0.2s ease;
        }

        .form-input::placeholder {
          color: var(--muted);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px var(--focus-offset);
        }

        .save-button {
          width: 100%;
          padding: 16px 24px;
          background: var(--brand);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: "Poppins", sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .save-button:hover {
          background: var(--brand-2);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(43, 135, 97, 0.25);
        }

        @media (max-width: 480px) {
          .edit-header {
            padding: 16px;
          }
          .edit-title {
            font-size: 20px;
          }
          .edit-content {
            padding: 16px;
          }
          .cover-img {
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
}