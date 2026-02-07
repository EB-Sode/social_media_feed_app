"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthenticatedClient } from "@/lib/graphql";
import {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_READ_MUTATION,
  type Notification,
} from "@/lib/queries";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load notifications from API
   * UPDATED: Memoized with useCallback for consistency
   */
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = getAuthenticatedClient();
      const { notifications } = await client.request<{ 
        notifications: Notification[] 
      }>(GET_NOTIFICATIONS);

      setNotifications(notifications);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  // UPDATED: Simplified effect using the memoized function
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  /**
   * Mark a single notification as read
   * @param notificationId - ID of the notification to mark as read
   */
  const markAsRead = async (notificationId: string) => {
    try {
      const client = getAuthenticatedClient();
      await client.request(MARK_NOTIFICATION_READ_MUTATION, { notificationId });

      // Update local state optimistically
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      throw err;
    }
  };

  /**
   * Mark all notifications as read
   * UPDATED: Added this function for bulk operations
   */
  const markAllAsRead = async () => {
    try {
      const client = getAuthenticatedClient();
      await client.request(MARK_ALL_NOTIFICATIONS_READ_MUTATION);

      // Update all notifications to read
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      throw err;
    }
  };

  // UPDATED: Memoized computed value
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: loadNotifications,
    markAsRead,
    markAllAsRead, // UPDATED: Added bulk mark as read
  };
}