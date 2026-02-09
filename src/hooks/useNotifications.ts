/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import {
  GET_NOTIFICATIONS,
  MARK_ALL_NOTIFICATIONS_READ_MUTATION,
  MARK_NOTIFICATION_READ_MUTATION,
  type Notification,
} from "@/lib/queries";

type Filter = "all" | "unread";

export function useNotificationsLive() {
  const [filter, setFilter] = useState<Filter>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const client = useMemo(() => getAuthenticatedClient(), []);
  const mountedRef = useRef(true);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await client.request<{ notifications: Notification[] }>(
        GET_NOTIFICATIONS,
        { limit: 50, unreadOnly: filter === "unread" }
      );

      if (!mountedRef.current) return;

      setNotifications(res.notifications ?? []);
      setError(null);
    } catch (e: any) {
      if (!mountedRef.current) return;
      setError(e?.message ?? "Failed to load notifications");
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
    }
  }, [client, filter]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchNotifications();
  }, [fetchNotifications]);

  // Polling = live (pause when tab is hidden)
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") fetchNotifications();
    };

    const id = window.setInterval(tick, 10000);
    return () => window.clearInterval(id);
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      // optimistic
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );

      try {
        await client.request(MARK_NOTIFICATION_READ_MUTATION, {
          notificationId: Number(notificationId), // backend expects Int
        });
      } catch {
        fetchNotifications(); // rollback by refetch
      }
    },
    [client, fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await client.request(MARK_ALL_NOTIFICATIONS_READ_MUTATION);
    } catch {
      fetchNotifications();
    }
  }, [client, fetchNotifications]);

  return {
    filter,
    setFilter,
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
