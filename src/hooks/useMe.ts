// src/hooks/useMe.ts
"use client";

import { useEffect, useState } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import { GET_ME } from "@/lib/queries";

type Me = { id: string; username: string };

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getAuthenticatedClient();
    client
      .request<{ me: Me | null }>(GET_ME)
      .then((res) => setMe(res.me))
      .finally(() => setLoading(false));
  }, []);

  return { me, loading };
}
