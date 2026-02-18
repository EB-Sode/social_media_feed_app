"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { warmupBackend } from "@/lib/warmupBacked";

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    warmupBackend(process.env.NEXT_PUBLIC_API_URL!);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!username || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }

    try {
      await login(username, password);
    } catch (err) {
      // Error is handled by AuthContext
      console.error("Login failed:", err);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth login
    console.log("Google login clicked");
    // You would integrate with Google OAuth here
  };



  const displayError = localError || error;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {displayError && <div className="error-message">{displayError}</div>}

          {/* Username/Email */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              username/email
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
                placeholder="Enter your password"
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
            <Link href="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">or login with</span>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.8055 10.2292C19.8055 9.55015 19.7501 8.86682 19.633 8.19983H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0875V17.5866H16.8251C18.7176 15.8449 19.8055 13.2728 19.8055 10.2292Z"
                fill="#4285F4"
              />
              <path
                d="M10.2002 20C12.9515 20 15.2664 19.1045 16.8251 17.5866L13.6025 15.0875C12.7031 15.6977 11.5524 16.0428 10.2002 16.0428C7.5462 16.0428 5.29067 14.2828 4.49251 11.9166H1.17773V14.4922C2.75886 17.6352 6.31128 20 10.2002 20Z"
                fill="#34A853"
              />
              <path
                d="M4.49251 11.9166C4.0451 10.6747 4.0451 9.32528 4.49251 8.08336V5.50781H1.17773C-0.392578 8.63808 -0.392578 12.3619 1.17773 15.4922L4.49251 11.9166Z"
                fill="#FBBC04"
              />
              <path
                d="M10.2002 3.95724C11.6315 3.93623 13.0118 4.47203 14.0408 5.45674L16.893 2.60458C15.1735 0.990818 12.7279 0.0953369 10.2002 0.118011C6.31128 0.118011 2.75886 2.48279 1.17773 5.50781L4.49251 8.08336C5.29067 5.71723 7.5462 3.95724 10.2002 3.95724Z"
                fill="#EA4335"
              />
            </svg>
            Login with Google
          </button>

          {/* Signup Link */}
          <p className="switch-auth">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="switch-link">
              Sign up
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
          background: #b1f5bf;
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

        .forgot-link {
          font-family: "Inter", sans-serif;
          font-size: 13px;
          color: #2b8761;
          text-decoration: none;
          text-align: right;
          font-weight: 500;
        }

        .forgot-link:hover {
          text-decoration: underline;
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

        .divider {
          position: relative;
          text-align: center;
          margin: 8px 0;
        }

        .divider::before,
        .divider::after {
          content: "";
          position: absolute;
          top: 50%;
          width: calc(50% - 60px);
          height: 1px;
          background: rgba(0, 0, 0, 0.2);
        }

        .divider::before {
          left: 0;
        }

        .divider::after {
          right: 0;
        }

        .divider-text {
          font-family: "Inter", sans-serif;
          font-size: 13px;
          color: #6b7280;
          background: #b1f5bf;
          padding: 0 12px;
        }

        .google-btn {
          width: 100%;
          padding: 12px 24px;
          background: white;
          color: #1f2937;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 12px;
          font-family: "Inter", sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .google-btn:hover:not(:disabled) {
          background: #f9fafb;
          border-color: rgba(0, 0, 0, 0.25);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .google-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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