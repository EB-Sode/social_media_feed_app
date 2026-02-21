"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        Made with <span className="heart">♥</span> SocialApp
      </p>

    <style jsx>{`
      .footer {
        padding: 16px 20px;
        text-align: center;
        background: var(--surface);
        border-top: 1px solid var(--border);
      }

      .footer-text {
        font-family: "Inter", sans-serif;
        font-size: 13px;
        color: var(--muted);
        margin: 0;
      }

      .heart {
        color: #ef4444; /* keep red brand color */
        display: inline-block;
        animation: heartbeat 1.5s ease-in-out infinite;
      }

      @keyframes heartbeat {
        0%, 100% {
          transform: scale(1);
        }
        10%, 30% {
          transform: scale(1.1);
        }
        20% {
          transform: scale(0.9);
        }
      }
    `}</style>

    </footer>
  );
}