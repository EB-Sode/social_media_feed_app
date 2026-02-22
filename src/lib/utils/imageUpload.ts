/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Image Upload Utilities
 */

/** Validate image file */
// export function validateImage(file: File): { valid: boolean; error?: string } {
//   if (!file.type.startsWith("image/")) {
//     return { valid: false, error: "File must be an image" };
//   }
//   const maxSize = 5 * 1024 * 1024; // 5MB
//   if (file.size > maxSize) {
//     return { valid: false, error: "Image size must be less than 5MB" };
//   }
//   return { valid: true };
// }

// /** Get image dimensions */
// export function getImageDimensions(
//   file: File
// ): Promise<{ width: number; height: number }> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const img = new Image();
//       img.onload = () => resolve({ width: img.width, height: img.height });
//       img.onerror = () => reject(new Error("Failed to load image"));
//       img.src = e.target?.result as string;
//     };
//     reader.onerror = () => reject(new Error("Failed to read file"));
//     reader.readAsDataURL(file);
//   });
// }

// /** Format file size for display */
// export function formatFileSize(bytes: number): string {
//   if (bytes === 0) return "0 Bytes";
//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
// }
/**
 * Upload Utilities
 * - Image validation
 * - Image metadata helpers
 * - GraphQL multipart upload request
 */

/* ===============================
   IMAGE VALIDATION
================================ */

export function validateImage(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: "Image size must be less than 5MB" };
  }

  return { valid: true };
}

/* ===============================
   IMAGE DIMENSIONS
================================ */

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () =>
        resolve({
          width: img.width,
          height: img.height,
        });

      img.onerror = () =>
        reject(new Error("Failed to load image"));

      img.src = e.target?.result as string;
    };

    reader.onerror = () =>
      reject(new Error("Failed to read file"));

    reader.readAsDataURL(file);
  });
}

/* ===============================
   FILE SIZE FORMATTER
================================ */

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Math.round((bytes / Math.pow(k, i)) * 100) / 100 +
    " " +
    sizes[i]
  );
}

/* ===============================
   GRAPHQL MULTIPART UPLOAD
================================ */

export async function graphqlUploadRequest<T>({
  endpoint,
  query,
  variables,
  file,
  fileVar = "image",
  token,
}: {
  endpoint: string;
  query: string;
  variables: Record<string, any>;
  file?: File | null;
  fileVar?: string;
  token?: string | null;
}): Promise<T> {
  const form = new FormData();

  form.append(
    "operations",
    JSON.stringify({
      query,
      variables: {
        ...variables,
        [fileVar]: file ? null : null, // must exist in variables for Upload
      },
    })
  );

  const map: Record<string, string[]> = {};
  if (file) {
    map["0"] = [`variables.${fileVar}`];
  }

  form.append("map", JSON.stringify(map));

  if (file) {
    form.append("0", file);
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
    body: form,
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    throw new Error(
      json?.errors?.[0]?.message ||
        `Upload failed (${res.status})`
    );
  }

  return json.data as T;
}
