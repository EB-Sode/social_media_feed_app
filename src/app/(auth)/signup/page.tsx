"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { signup, loading, error, clearError } = useAuth();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    // Validation
    if (!username || !email || !password) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      await signup({ username, email, password, bio: bio || undefined });
    } catch (err) {
      // Error is handled by AuthContext
      console.error("Signup failed:", err);
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Signup</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {displayError && <div className="error-message">{displayError}</div>}

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="John"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Bio (optional) */}
          <div className="form-group">
            <label htmlFor="bio" className="form-label">
              bio(optional)
            </label>
            <input
              id="bio"
              type="text"
              className="form-input"
              placeholder=""
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={2} />
                ) : (
                  <Eye size={20} strokeWidth={2} />
                )}
              </button>
            </div>
            <p className="form-hint">must contain 8 char.</p>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} strokeWidth={2} />
                ) : (
                  <Eye size={20} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Terms & Privacy */}
          <p className="terms-text">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="terms-link">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="terms-link">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Login Link */}
          <p className="switch-auth">
            Already have an account?{" "}
            <Link href="/login" className="switch-link">
              Login
            </Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #808080;
          padding: 20px;
          width: 100%;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: #b1f5bf;
          border-radius: 16px;
          padding: 48px 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .auth-title {
          font-family: "Poppins", sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #1f2937;
          text-align: center;
          margin: 0 0 32px 0;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px 16px;
          border-radius: 8px;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #fecaca;
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
          color: #1f2937;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          color: #1f2937;
          transition: all 0.2s ease;
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .form-input:focus {
          outline: none;
          border-color: #2b8761;
          box-shadow: 0 0 0 3px rgba(43, 135, 97, 0.1);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .password-toggle:hover:not(:disabled) {
          color: #1f2937;
        }

        .password-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .password-toggle :global(svg) {
          color: currentColor;
        }

        .form-hint {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          color: #2b8761;
          margin: 0;
        }

        .submit-btn {
          width: 100%;
          padding: 14px 24px;
          background: #2b8761;
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

        .submit-btn:hover:not(:disabled) {
          background: #1f6949;
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

        .terms-text {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          color: #1f2937;
          text-align: center;
          margin: 4px 0 0 0;
          line-height: 1.5;
        }

        .terms-link {
          color: #2b8761;
          text-decoration: none;
          font-weight: 500;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        .switch-auth {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          color: #1f2937;
          text-align: center;
          margin: 8px 0 0 0;
        }

        .switch-link {
          color: #2b8761;
          text-decoration: none;
          font-weight: 600;
        }

        .switch-link:hover {
          text-decoration: underline;
        }

        /* Responsive */
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