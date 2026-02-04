/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
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

    // Validation
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

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || "Failed to send reset email.");
      }
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

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="success-icon-wrapper">
            <CheckCircle size={64} strokeWidth={2} className="success-icon" />
          </div>

          <h1 className="auth-title">Check Your Email</h1>

          <p className="success-message">
            We've sent a password reset link to <strong>{email}</strong>
          </p>

          <p className="success-submessage">
            Click the link in the email to reset your password. If you don't see
            the email, check your spam folder.
          </p>

          <div className="success-actions">
            <Link href="/login" className="back-to-login-btn">
              Back to Login
            </Link>

            <button
              className="resend-btn"
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
            >
              Try Another Email
            </button>
          </div>

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

            .success-message strong {
              font-weight: 600;
              color: #2b8761;
            }

            .success-submessage {
              font-family: "Inter", sans-serif;
              font-size: 14px;
              color: #6b7280;
              text-align: center;
              margin: 0 0 32px 0;
              line-height: 1.6;
            }

            .success-actions {
              display: flex;
              flex-direction: column;
              gap: 12px;
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

            .resend-btn {
              width: 100%;
              padding: 14px 24px;
              background: white;
              color: #2b8761;
              border: 1px solid #2b8761;
              border-radius: 12px;
              font-family: "Inter", sans-serif;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .resend-btn:hover {
              background: rgba(43, 135, 97, 0.05);
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Back Button */}
        <Link href="/login" className="back-button">
          <ArrowLeft size={20} strokeWidth={2} />
          <span>Back to Login</span>
        </Link>

        {/* Icon */}
        <div className="icon-wrapper">
          <Mail size={48} strokeWidth={2} className="mail-icon" />
        </div>

        <h1 className="auth-title">Forgot Password?</h1>

        <p className="subtitle">
          No worries! Enter your email address and we'll send you a link to reset
          your password.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
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
          position: relative;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #1f2937;
          text-decoration: none;
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 24px;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: rgba(31, 41, 55, 0.1);
        }

        .back-button :global(svg) {
          color: currentColor;
        }

        .icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .mail-icon {
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