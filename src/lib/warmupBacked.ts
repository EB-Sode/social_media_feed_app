/* eslint-disable @typescript-eslint/no-unused-vars */
export async function warmupBackend(baseUrl: string) {
  const healthUrl = `${baseUrl.replace(/\/$/, "")}/health/`;

  let delay = 500;
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch(healthUrl, { cache: "no-store" });
      if (res.ok) return true;
    } catch (_) {}

    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay * 1.7, 5000);
  }
  return false;
}
