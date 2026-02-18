"use client";

import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { warmupBackend } from "@/lib/warmupBacked";


type Slide = {
  title: string;
  subtitle: string;
  cta: string;
  bgImage: string; // full background image inside card
  logoText?: string; // optional if you want
};



export default function OnboardingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Welcome",
        subtitle: "we’re glad that\nyou are here",
        cta: "Lets get started",
        // replace with your own image in /public if you have one
        bgImage: "/plant.jpg",
        logoText: "RB",
      },
      {
        title: "Connect",
        subtitle: "follow friends\nand creators",
        cta: "Continue",
        bgImage: "/plant.jpg",
        logoText: "RB",
      },
      {
        title: "Share",
        subtitle: "post photos\nand updates",
        cta: "Continue",
        bgImage: "/plant.jpg",
        logoText: "RB",
      },
    ],
    []
  );

  useEffect(() => {
    warmupBackend(process.env.NEXT_PUBLIC_API_URL!);
    }, []);


  useEffect(() => {
  if (isAuthenticated) {
    router.replace("/feed");
  }
}, [isAuthenticated, router]);

  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const goNext = () => setIndex((p) => (p + 1) % slides.length);
  const goTo = (i: number) => setIndex(i);

  return (
    <div className="page">
      <div className="card">
        {/* Left: text */}
        <section className="left">
          <h1 className="title">{slide.title}</h1>
          <div className="underline" />

          <p className="subtitle">{slide.subtitle}</p>

          <button className="cta" type="button" onClick={goNext}>
            {slide.cta}
          </button>

          <div className="auth-row">
            <button className="btn outline" type="button" onClick={() => router.push("/signup")}>
              Register
            </button>
            <button className="btn solid" type="button" onClick={() => router.push("/login")}>
              Login
            </button>
          </div>

          <div className="dots" aria-label="Onboarding steps">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`dot ${i === index ? "active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <div className="google-wrap">
            <button
              type="button"
              className="google"
              onClick={() => alert("Hook up Google auth here")}
            >
              <span className="g">G</span>
              Login with Google
            </button>
          </div>
        </section>

        {/* Right: logo + image */}
        <section className="right">
          <div className="logoBox">
            <div className="logoMark">{slide.logoText ?? "RB"}</div>
            <div className="logoSub">RSBCRS</div>
          </div>

          <Image
            src={slide.bgImage}
            alt="Onboarding"
            fill
            className="bg"
            priority
            />

        </section>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          width: 100%;
          display: grid;
          place-items: center;
          background: #b1f5bf;
          padding: 24px;
        }

        .card {
          width: min(1100px, 100%);
          height: min(620px, 92vh);
          background: rgba(255, 255, 255, 0.55);
          border-radius: 28px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          backdrop-filter: blur(6px);
        }

        .left {
          padding: 70px 56px 40px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          z-index: 2;
        }

        .title {
          font-family: "Poppins", sans-serif;
          font-size: 56px;
          line-height: 1;
          margin: 0;
          color: #2b8761;
          font-weight: 800;
        }

        .underline {
          width: 240px;
          height: 4px;
          background: #2b8761;
          border-radius: 999px;
          margin-top: 6px;
        }

        .subtitle {
          white-space: pre-line;
          font-family: "Inter", sans-serif;
          font-size: 18px;
          line-height: 1.4;
          color: #2b8761;
          margin: 8px 0 26px 0;
          font-weight: 500;
        }

        .cta {
          width: 220px;
          padding: 14px 18px;
          border-radius: 999px;
          border: none;
          background: rgba(43, 135, 97, 0.9);
          color: #fff;
          font-family: "Poppins", sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .cta:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        .auth-row {
          display: flex;
          gap: 16px;
          margin-top: 26px;
        }

        .btn {
          width: 180px;
          height: 44px;
          border-radius: 999px;
          font-family: "Inter", sans-serif;
          font-weight: 700;
          cursor: pointer;
        }

        .outline {
          border: 2px solid #1f2937;
          background: transparent;
          color: #1f2937;
        }

        .solid {
          border: none;
          background: #2b8761;
          color: white;
        }

        .dots {
          display: flex;
          gap: 12px;
          margin-top: 14px;
          align-items: center;
        }

        .dot {
          width: 34px;
          height: 8px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: rgba(31, 41, 55, 0.15);
          transition: all 0.2s ease;
        }

        .dot.active {
          background: rgba(43, 135, 97, 0.85);
          width: 52px;
        }

        .google-wrap {
          margin-top: 22px;
        }

        .google {
          width: 380px;
          max-width: 100%;
          height: 50px;
          border-radius: 999px;
          border: 2px solid rgba(31, 41, 55, 0.25);
          background: rgba(255, 255, 255, 0.55);
          font-family: "Inter", sans-serif;
          font-weight: 700;
          color: #1f2937;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
        }

        .g {
          display: inline-grid;
          place-items: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.08);
          font-weight: 900;
        }

        .right {
          position: relative;
          overflow: hidden;
        }

        .bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.75;
          transform: scale(1.02);
        }

        .logoBox {
          position: absolute;
          top: 70px;
          right: 70px;
          z-index: 3;
          text-align: center;
          padding: 18px 22px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(6px);
        }

        .logoMark {
          font-family: "Poppins", sans-serif;
          font-weight: 900;
          font-size: 86px;
          line-height: 0.9;
          color: #1f2937;
          letter-spacing: -2px;
        }

        .logoSub {
          margin-top: 4px;
          font-family: "Inter", sans-serif;
          font-weight: 800;
          color: rgba(43, 135, 97, 0.7);
          letter-spacing: 2px;
          font-size: 12px;
        }

        @media (max-width: 920px) {
          .card {
            grid-template-columns: 1fr;
            height: auto;
          }
          .right {
            min-height: 260px;
          }
          .left {
            padding: 50px 26px 26px;
          }
          .logoBox {
            top: 18px;
            right: 18px;
          }
          .title {
            font-size: 44px;
          }
          .google {
            width: 100%;
          }
          .auth-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
