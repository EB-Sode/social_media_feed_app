"use client";

import React, { useState } from "react";
import { ArrowLeft, Camera } from "lucide-react";

interface EditProfileProps {
  onClose: () => void;
}

export default function EditProfile({ onClose }: EditProfileProps) {
  const [name, setName] = useState("Melissa Peters");
  const [email, setEmail] = useState("melpeters@gmail.com");
  const [password, setPassword] = useState("••••••••••");
  const [dateOfBirth, setDateOfBirth] = useState("23/05/1995");
  const [country, setCountry] = useState("Nigeria");

  const handleSave = () => {
    // Save logic here
    console.log("Saving profile changes...");
    onClose();
  };

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-container">
        {/* Header */}
        <header className="edit-header">
          <button className="back-button" onClick={onClose} aria-label="Back">
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
          <h1 className="edit-title">Edit Profile</h1>
        </header>

        {/* Content */}
        <div className="edit-content">
          {/* Avatar */}
          <div className="avatar-section">
            <div className="avatar-container">
              <img
                src="/api/placeholder/120/120"
                alt="Profile"
                className="edit-avatar"
              />
              <button className="camera-button" aria-label="Change photo">
                <Camera size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form className="edit-form" onSubmit={(e) => e.preventDefault()}>
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label htmlFor="dob" className="form-label">
                Date of Birth
              </label>
              <div className="select-wrapper">
                <input
                  id="dob"
                  type="text"
                  className="form-input"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="select-icon"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Country/Region */}
            <div className="form-group">
              <label htmlFor="country" className="form-label">
                Country/Region
              </label>
              <div className="select-wrapper">
                <input
                  id="country"
                  type="text"
                  className="form-input"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="select-icon"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Save Button */}
            <button type="button" className="save-button" onClick={handleSave}>
              Save changes
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .edit-profile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #b1f5bf;
          z-index: 100;
          overflow-y: auto;
        }

        .edit-profile-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          min-height: 100vh;
          background: #b1f5bf;
        }

        .edit-header {
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

        .edit-title {
          font-family: "Poppins", sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .edit-content {
          padding: 32px 24px;
        }

        .avatar-section {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
        }

        .avatar-container {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .edit-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #b1f5bf;
        }

        .camera-button {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          height: 40px;
          background: #2b8761;
          border: 3px solid #b1f5bf;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .camera-button:hover {
          background: #1f6949;
          transform: scale(1.05);
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
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
          color: #1f2937;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          color: #1f2937;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #2b8761;
          box-shadow: 0 0 0 3px rgba(43, 135, 97, 0.1);
        }

        .select-wrapper {
          position: relative;
        }

        .select-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
        }

        .save-button {
          width: 100%;
          padding: 16px 24px;
          background: #1f2937;
          color: white;
          border: none;
          border-radius: 12px;
          font-family: "Poppins", sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 12px;
        }

        .save-button:hover {
          background: #111827;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(31, 41, 55, 0.3);
        }

        .save-button:active {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          .edit-header {
            padding: 16px 16px;
          }

          .edit-title {
            font-size: 20px;
          }

          .edit-content {
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  );
}