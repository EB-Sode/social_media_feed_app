// "use client";

// import { useSearchParams } from "next/navigation";
// import UsersDirectory from "@/components/users/UsersDirectory";

// export default function SearchPage() {
//   const params = useSearchParams();
//   const query = params.get("query") || "";

//   // If you have currentUserId in store/auth hook, pass it here.
//   const currentUserId = undefined;

//   return (
//     <main className="max-w-2xl mx-auto w-full">
//       <UsersDirectory query={query} currentUserId={currentUserId} />
//     </main>
//   );
// }
import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6">
          <p className="text-sm text-gray-600">Loading search…</p>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
