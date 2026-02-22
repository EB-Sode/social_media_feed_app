
const RAW_BASE =
  process.env.NEXT_PUBLIC_BACKEND_BASE || "http://localhost:8000";

const BACKEND_BASE = RAW_BASE.replace(/\/graphql\/?$/, "").replace(/\/$/, "");

export function resolveMediaUrl(src?: string | null) {
  const clean = (src ?? "").trim();
  if (!clean) return null;

  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  if (clean.startsWith("/")) return `${BACKEND_BASE}${clean}`;
  return `${BACKEND_BASE}/media/${clean}`;
}

export function imgSrc(src?: string | null, fallback = "/default-avatar.png") {
  return resolveMediaUrl(src) ?? fallback;
}
