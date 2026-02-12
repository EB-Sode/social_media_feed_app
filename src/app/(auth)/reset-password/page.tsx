import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#808080] p-5">
          <div className="w-full max-w-[420px] bg-[#b1f5bf] rounded-2xl px-10 py-12 shadow-[0_10px_40px_rgba(0,0,0,0.15)] max-[480px]:px-6 max-[480px]:py-8">
            <p className="text-center text-[#1f2937] font-semibold">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
