/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, Lock } from "lucide-react";
import { resetPassword, validatePassword, formatAuthError } from "@/lib/auth-utils";
import Image from "next/image";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid or missing reset token.");
      setToken(null);
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!token) return setError("Invalid reset token.");
    if (!password || !confirmPassword) return setError("Please fill in all fields.");

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) return setError(passwordValidation.errors[0]);

    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const response = await resetPassword(token, password);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(response.message || "Failed to reset password.");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("❌ Reset password error:", err);
        setError(formatAuthError(err));
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
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

          <div className="success-wrap">
            <CheckCircle size={64} strokeWidth={2} />
          </div>

          <h1 className="auth-title">Password Reset!</h1>

          <p className="auth-subtitle">
            Your password has been successfully reset. You can now log in with your new password.
          </p>

          <p className="auth-subtitle muted">Redirecting to login page in 3 seconds...</p>

          <Link href="/login" className="submit-btn link-btn">
            Go to Login Now
          </Link>
        </div>

        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
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

        <Link href="/login" className="back-link">
          <span className="backIcon" aria-hidden>
            ←
          </span>
          <span>Back to Login</span>
        </Link>

        <div className="icon-wrap">
          <Lock size={48} strokeWidth={2} />
        </div>

        <h1 className="auth-title">Reset Password</h1>

        <p className="auth-subtitle">
          Please enter your new password below. Make sure it's at least 8 characters long.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          {/* New Password */}
          <div className="form-group">
            <label className="form-label">New Password</label>

            <div className="input-with-actions">
              <Lock size={18} strokeWidth={2} className="input-icon" />

              <input
                type={showPassword ? "text" : "password"}
                className="form-input icon-input action-input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                disabled={loading || !token}
              />

              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <p className="hint-text">Must contain at least 8 characters.</p>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>

            <div className="input-with-actions">
              <Lock size={18} strokeWidth={2} className="input-icon" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-input icon-input action-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !token}
              />

              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading || !token} className="submit-btn">
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="switch-auth">
            Remember your password?{" "}
            <Link href="/login" className="switch-link">
              Login
            </Link>
          </p>
        </form>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
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

  .backIcon {
    font-size: 16px;
    line-height: 1;
    opacity: 0.85;
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

  .input-with-actions {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    color: var(--muted);
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    font-family: "Inter", sans-serif;
    font-size: 15px;
    color: var(--text);
    transition: all 0.2s ease;
  }

  .icon-input {
    padding-left: 44px;
  }

  .action-input {
    padding-right: 48px;
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

  .icon-btn {
    position: absolute;
    right: 10px;
    height: 38px;
    width: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    background: transparent;
    color: var(--muted);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .icon-btn:hover {
    background: var(--surface-2);
    color: var(--text);
    border-color: var(--border);
  }

  .hint-text {
    font-family: "Inter", sans-serif;
    font-size: 12px;
    color: var(--brand);
    margin: 2px 0 0 0;
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

  @media (max-width: 480px) {
    .auth-card {
      padding: 32px 24px;
    }
    .auth-title {
      font-size: 28px;
    }
  }
`;