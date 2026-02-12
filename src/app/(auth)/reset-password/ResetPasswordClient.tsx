/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, Lock } from "lucide-react";
import { resetPassword, validatePassword, formatAuthError } from "@/lib/auth-utils";

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

    if (!token) {
      setError("Invalid reset token.");
      return;
    }

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

  const pageWrap =
    "min-h-screen flex items-center justify-center bg-[#808080] p-5";
  const card =
    "w-full max-w-[420px] bg-[#b1f5bf] rounded-2xl px-10 py-12 shadow-[0_10px_40px_rgba(0,0,0,0.15)] max-[480px]:px-6 max-[480px]:py-8";
  const title =
    'font-["Poppins"] text-[32px] font-bold text-[#1f2937] text-center mb-4 max-[480px]:text-[28px]';

  if (success) {
    return (
      <div className={pageWrap}>
        <div className={card}>
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} strokeWidth={2} className="text-[#2B8761]" />
          </div>

          <h1 className={title}>Password Reset!</h1>

          <p className="font-['Inter'] text-[15px] text-[#1f2937] text-center mb-4 leading-relaxed">
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>

          <p className="font-['Inter'] text-[13px] text-[#6b7280] text-center mb-6">
            Redirecting to login page in 3 seconds...
          </p>

          <Link
            href="/login"
            className="w-full block text-center rounded-xl bg-[#2B8761] text-white py-3 font-semibold hover:bg-[#1F6949] transition shadow-none hover:shadow-[0_6px_20px_rgba(43,135,97,0.3)] hover:-translate-y-[2px] transform"
          >
            Go to Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrap}>
      <div className={card}>
        <div className="flex justify-center mb-5">
          <Lock size={48} strokeWidth={2} className="text-[#2B8761]" />
        </div>

        <h1 className={title}>Reset Password</h1>

        <p className="font-['Inter'] text-[15px] text-[#6b7280] text-center mb-8 leading-relaxed">
          Please enter your new password below. Make sure it's at least 8 characters long.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-100 text-red-800 border border-red-200 px-4 py-3 rounded-lg font-['Inter'] text-sm font-medium">
              {error}
            </div>
          )}

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className="font-['Inter'] text-sm font-medium text-[#1f2937]">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white font-['Inter'] text-[15px] focus:outline-none focus:border-[#2B8761] focus:ring-4 focus:ring-[rgba(43,135,97,0.1)] transition"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1f2937] transition"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <p className="text-xs text-[#2B8761] font-['Inter']">
              Must contain at least 8 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="font-['Inter'] text-sm font-medium text-[#1f2937]">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white font-['Inter'] text-[15px] focus:outline-none focus:border-[#2B8761] focus:ring-4 focus:ring-[rgba(43,135,97,0.1)] transition"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1f2937] transition"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-xl bg-[#2B8761] text-white py-3 font-semibold font-['Poppins'] hover:bg-[#1F6949] transition disabled:opacity-60 disabled:cursor-not-allowed shadow-none hover:shadow-[0_6px_20px_rgba(43,135,97,0.3)] hover:-translate-y-[2px] transform"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

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
