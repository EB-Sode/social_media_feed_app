/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

interface PostCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, imageFile?: File) => Promise<void>;
  userAvatar?: string | null;
  username: string;
}

export default function PostCreateModal({
  isOpen,
  onClose,
  onSubmit,
  userAvatar,
  username,
}: PostCreateModalProps) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  /** Handle image selection */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: validate size/type here
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image", "error");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /** Remove selected image */
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !imageFile) {
      showToast("Please add content or an image", "warning");
      return;
    }

    if (content.length > 100) {
      showToast("Content exceeds 100 characters", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), imageFile || undefined);

      // Reset
      setContent("");
      handleRemoveImage();
      showToast("Post created successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
      showToast("Failed to create post", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Handle modal close */
  const handleClose = () => {
    if (isSubmitting) return;
    if (content || imageFile && !confirm("Discard this post?")) return;

    setContent("");
    handleRemoveImage();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={handleClose} />
      <div className="modal-container">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h2>Create Post</h2>
            <button
              className="close-btn"
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* User Info */}
            <div className="user-info">
              <div className="avatar">
                {userAvatar ? (
                  <img src={userAvatar} alt={username} />
                ) : (
                  username.charAt(0).toUpperCase()
                )}
              </div>
              <span className="username">{username}</span>
            </div>

            {/* Content Input */}
            <textarea
              className="content-input"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={5}
              autoFocus
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  aria-label="Remove image"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="modal-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "none" }}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="image-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <ImageIcon size={20} />
                <span>Add Photo</span>
              </button>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting || (!content.trim() && !imageFile)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="spinner" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-container {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .close-btn:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.05);
        }

        .close-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        form {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          flex: 1;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px 16px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2b8761, #1f6949);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          overflow: hidden;
          flex-shrink: 0;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .username {
          font-weight: 600;
          font-size: 14px;
        }

        .content-input {
          width: 100%;
          padding: 0 24px;
          border: none;
          outline: none;
          font-size: 16px;
          font-family: inherit;
          resize: none;
          line-height: 1.5;
        }

        .content-input:disabled {
          background: transparent;
          cursor: not-allowed;
        }

        .image-preview {
          margin: 16px 24px;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .image-preview img {
          width: 100%;
          display: block;
          max-height: 400px;
          object-fit: contain;
        }

        .remove-image-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.2s;
        }

        .remove-image-btn:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.9);
        }

        .upload-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          color: #6b7280;
          font-size: 14px;
        }

        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          gap: 12px;
        }

        .image-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          color: #374151;
        }

        .image-btn:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .image-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: #2b8761;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #1f6949;
        }

        .submit-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .submit-btn :global(.spinner),
        .upload-progress :global(.spinner) {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
