/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { forgotPassword, validateEmail, formatAuthError } from "@/lib/auth-utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response.success) setSuccess(true);
      else setError(response.message || "Failed to send reset email.");
    } catch (err) {
      if (err instanceof Error) {
        console.error("❌ Forgot password error:", err);
        setError(formatAuthError(err));
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo (matches login mode) */}
        <div className="logoBox">
          <Image
            src="/rebes3.jpeg"
            alt="App logo"
            width={100}
            height={100}
            className="app-logo"
            priority
          />
        </div>

        {!success ? (
          <>
            {/* Back Button */}
            <Link href="/login" className="back-link">
              <ArrowLeft size={18} strokeWidth={2} />
              <span>Back to Login</span>
            </Link>

            {/* Icon */}
            <div className="icon-wrap">
              <Mail size={48} strokeWidth={2} />
            </div>

            <h1 className="auth-title">Forgot Password?</h1>

            <p className="auth-subtitle">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>

                <div className="input-with-icon">
                  <input
                    id="email"
                    type="email"
                    className="form-input icon-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoFocus
                    autoComplete="email"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="switch-auth">
                Remember your password?{" "}
                <Link href="/login" className="switch-link">
                  Login
                </Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <div className="success-wrap">
              <CheckCircle size={64} strokeWidth={2} />
            </div>

            <h1 className="auth-title">Check Your Email</h1>

            <p className="auth-subtitle">
              We've sent a password reset link to{" "}
              <span className="success-email">{email}</span>
            </p>

            <p className="auth-subtitle muted">
              Click the link in the email to reset your password. If you don't see the email, check
              your spam folder.
            </p>

            <div className="success-actions">
              <Link href="/login" className="submit-btn link-btn">
                Back to Login
              </Link>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                  setError("");
                }}
              >
                Try Another Email
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%);
          padding: 20px;
          width: 100%;
          color: var(--text);
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 48px 40px;
          box-shadow: 0 10px 40px var(--shadow);
        }

        .logoBox {
          position: relative;
          z-index: 3;
          text-align: center;
          padding: 18px 22px;
          border-radius: 18px;
          backdrop-filter: blur(6px);
          border: 1px solid var(--border);
          margin-bottom: 18px;
          display: flex;
          justify-content: center;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: "Inter", sans-serif;
          font-size: 13px;
          color: var(--text);
          text-decoration: none;
          font-weight: 600;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }

        .back-link:hover {
          background: var(--surface-2);
          border-color: var(--border);
        }

        .icon-wrap {
          display: flex;
          justify-content: center;
          margin: 6px 0 10px;
          color: var(--brand);
        }

        .success-wrap {
          display: flex;
          justify-content: center;
          margin: 6px 0 14px;
          color: var(--brand);
        }

        .auth-title {
          font-family: "Poppins", sans-serif;
          font-size: 34px;
          font-weight: 700;
          color: var(--text);
          text-align: center;
          margin: 0 0 14px 0;
        }

        .auth-subtitle {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          color: var(--text);
          text-align: center;
          margin: 0 0 18px 0;
          line-height: 1.55;
        }

        .auth-subtitle.muted {
          color: var(--muted);
          margin-top: -6px;
        }

        .success-email {
          color: var(--brand);
          font-weight: 700;
          word-break: break-word;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 8px;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.12);
          color: #b91c1c;
          padding: 12px 16px;
          border-radius: 8px;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        html.dark .error-message {
          background: rgba(239, 68, 68, 0.14);
          color: #fecaca;
          border: 1px solid rgba(239, 68, 68, 0.28);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          color: var(--text);
          transition: all 0.2s ease;
        }

        .icon-input {
          padding-left: 44px;
        }

        .form-input::placeholder {
          color: var(--muted);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px var(--focus-offset);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-btn {
          width: 100%;
          padding: 14px 24px;
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
          text-align: center;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--brand-2);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(43, 135, 97, 0.3);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .link-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .secondary-btn {
          width: 100%;
          padding: 12px 24px;
          background: var(--surface);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .secondary-btn:hover {
          background: var(--surface-2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px var(--shadow);
        }

        .switch-auth {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          color: var(--text);
          text-align: center;
          margin: 8px 0 0 0;
        }

        .switch-link {
          color: var(--brand);
          text-decoration: none;
          font-weight: 600;
        }

        .switch-link:hover {
          text-decoration: underline;
        }

        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 32px 24px;
          }
          .auth-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}