/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
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

  // Shared Tailwind styles
  const pageWrap = "min-h-screen flex items-center justify-center bg-[#808080] p-5";
  const card =
    "w-full max-w-[420px] bg-[#b1f5bf] rounded-2xl px-10 py-12 shadow-[0_10px_40px_rgba(0,0,0,0.15)] relative max-[480px]:px-6 max-[480px]:py-8";
  const title =
    'font-["Poppins"] text-[32px] font-bold text-[#1f2937] text-center mb-4 max-[480px]:text-[28px]';

  if (success) {
    return (
      <div className={pageWrap}>
        <div className={card}>
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} strokeWidth={2} className="text-[#2B8761]" />
          </div>

          <h1 className={title}>Check Your Email</h1>

          <p className="font-['Inter'] text-[15px] text-[#1f2937] text-center mb-4 leading-relaxed">
            We've sent a password reset link to{" "}
            <strong className="font-semibold text-[#2B8761] break-all">{email}</strong>
          </p>

          <p className="font-['Inter'] text-[14px] text-[#6b7280] text-center mb-8 leading-relaxed">
            Click the link in the email to reset your password. If you don't see
            the email, check your spam folder.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full rounded-xl bg-[#2B8761] text-white py-3 font-semibold text-center hover:bg-[#1F6949] transition shadow-none hover:shadow-[0_6px_20px_rgba(43,135,97,0.3)] hover:-translate-y-[2px] transform"
            >
              Back to Login
            </Link>

            <button
              type="button"
              className="w-full rounded-xl bg-white text-[#2B8761] border border-[#2B8761] py-3 font-semibold hover:bg-[rgba(43,135,97,0.05)] transition"
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
            >
              Try Another Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrap}>
      <div className={card}>
        {/* Back Button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[#1f2937] font-['Inter'] text-sm font-medium mb-6 px-3 py-2 rounded-lg hover:bg-[rgba(31,41,55,0.1)] transition"
        >
          <ArrowLeft size={20} strokeWidth={2} />
          <span>Back to Login</span>
        </Link>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <Mail size={48} strokeWidth={2} className="text-[#2B8761]" />
        </div>

        <h1 className={title}>Forgot Password?</h1>

        <p className="font-['Inter'] text-[15px] text-[#6b7280] text-center mb-8 leading-relaxed">
          No worries! Enter your email address and we'll send you a link to reset
          your password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-100 text-red-800 border border-red-200 px-4 py-3 rounded-lg font-['Inter'] text-sm font-medium">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-['Inter'] text-sm font-medium text-[#1f2937]">
              Email Address
            </label>

            <div className="flex items-center gap-2 rounded-xl bg-white/70 border border-black/10 px-3 py-3 focus-within:border-[#2B8761] focus-within:ring-4 focus-within:ring-[rgba(43,135,97,0.1)] transition">
              <Mail size={18} className="text-[#1f2937]/60" />
              <input
                id="email"
                type="email"
                className="w-full bg-transparent outline-none font-['Inter'] text-[15px] text-[#1f2937] placeholder:text-gray-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2B8761] text-white py-3 font-semibold font-['Poppins'] hover:bg-[#1F6949] transition disabled:opacity-60 disabled:cursor-not-allowed shadow-none hover:shadow-[0_6px_20px_rgba(43,135,97,0.3)] hover:-translate-y-[2px] transform"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {/* Login Link */}
          <p className="text-center font-['Inter'] text-sm text-[#1f2937] mt-2">
            Remember your password?{" "}
            <Link href="/login" className="text-[#2B8761] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
