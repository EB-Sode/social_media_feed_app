/* eslint-disable @typescript-eslint/no-explicit-any */
export async function graphqlUploadRequest<T>({
  endpoint,
  query,
  variables,
  file,        // a File object
  fileVar = "image", // variable name in GraphQL: $image
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
        [fileVar]: file ? null : null, // must exist in variables
      },
    })
  );

  const map: Record<string, string[]> = {};
  if (file) map["0"] = [`variables.${fileVar}`];

  form.append("map", JSON.stringify(map));
  if (file) form.append("0", file);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });

  const json = await res.json();

  if (!res.ok || json.errors) {
    throw new Error(json?.errors?.[0]?.message || `Upload failed (${res.status})`);
  }

  return json.data as T;
}
