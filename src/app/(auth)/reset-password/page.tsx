/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, Lock } from "lucide-react";
import { resetPassword, validatePassword, formatAuthError } from "@/lib/auth-utils";

export default function ResetPasswordPage() {
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
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset token.");
      return;
    }

    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, password);

      if (response.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
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
          <div className="success-icon-wrapper">
            <CheckCircle size={64} strokeWidth={2} className="success-icon" />
          </div>

          <h1 className="auth-title">Password Reset!</h1>

          <p className="success-message">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>

          <p className="redirect-message">
            Redirecting to login page in 3 seconds...
          </p>

          <Link href="/login" className="back-to-login-btn">
            Go to Login Now
          </Link>

          <style jsx>{`
            .success-icon-wrapper {
              display: flex;
              justify-content: center;
              margin-bottom: 24px;
            }

            .success-icon {
              color: #2b8761;
            }

            .success-message {
              font-family: "Inter", sans-serif;
              font-size: 15px;
              color: #1f2937;
              text-align: center;
              margin: 0 0 16px 0;
              line-height: 1.6;
            }

            .redirect-message {
              font-family: "Inter", sans-serif;
              font-size: 13px;
              color: #6b7280;
              text-align: center;
              margin: 0 0 24px 0;
            }

            .back-to-login-btn {
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
              text-align: center;
              text-decoration: none;
              display: block;
            }

            .back-to-login-btn:hover {
              background: #1f6949;
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(43, 135, 97, 0.3);
            }
          `}</style>
        </div>

        <style jsx>{`
          .auth-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #808080;
            padding: 20px;
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
            font-size: 32px;
            font-weight: 700;
            color: #1f2937;
            text-align: center;
            margin: 0 0 24px 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Icon */}
        <div className="icon-wrapper">
          <Lock size={48} strokeWidth={2} className="lock-icon" />
        </div>

        <h1 className="auth-title">Reset Password</h1>

        <p className="subtitle">
          Please enter your new password below. Make sure it's at least 8
          characters long.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
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
              Confirm New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
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
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading || !token}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {/* Login Link */}
          <p className="switch-auth">
            Remember your password?{" "}
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
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: #b1f5bf;
          border-radius: 16px;
          padding: 48px 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .lock-icon {
          color: #2b8761;
        }

        .auth-title {
          font-family: "Poppins", sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          text-align: center;
          margin: 0 0 16px 0;
        }

        .subtitle {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          color: #6b7280;
          text-align: center;
          margin: 0 0 32px 0;
          line-height: 1.6;
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

        .password-toggle:hover {
          color: #1f2937;
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