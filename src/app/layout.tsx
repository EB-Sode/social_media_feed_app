import "../styles/global.css";

import React from "react";

export const metadata = {
  title: "SocialApp",
  description: "Social media feed built with Next.js + TailwindCSS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-background font-body text-textPrimary">
        {children}
      </body>
    </html>
  );
}
