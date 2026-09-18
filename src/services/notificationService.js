import { USE_MOCK_DATA } from "./firebase";
import {
  notificationsStore,
  setNotifications,
  usersStore,
} from "./dataStore";
import { generateId } from "../utils/helpers";

export const fetchNotifications = async (userId) => {
  const all = notificationsStore.all() || [];
  const filtered = userId
    ? all.filter((n) => n.userId === userId || n.userId === "broadcast")
    : all;
  return Promise.resolve([...filtered].reverse());
};

export const fetchUnreadCount = async (userId) => {
  const unread = notificationsStore.unread(userId);
  return Promise.resolve(unread.length);
};

export const createNotification = async (payload) => {
  if (USE_MOCK_DATA) {
    const notifications = notificationsStore.all() || [];
    const notif = {
      id: generateId("notif"),
      userId: payload.userId || "broadcast",
      title: payload.title,
      message: payload.message,
      type: payload.type || "info",
      read: false,
      createdAt: new Date().toISOString(),
      link: payload.link || null,
    };
    notifications.unshift(notif);
    setNotifications(notifications);
    return Promise.resolve(notif);
  }
  return Promise.resolve(null);
};

export const markNotificationRead = async (id) => {
  if (USE_MOCK_DATA) {
    const notifications = notificationsStore.all() || [];
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx === -1) return Promise.resolve(null);
    notifications[idx].read = true;
    setNotifications(notifications);
    return Promise.resolve(notifications[idx]);
  }
  return Promise.resolve(null);
};

export const markAllNotificationsRead = async (userId) => {
  if (USE_MOCK_DATA) {
    const notifications = notificationsStore.all() || [];
    notifications.forEach((n) => {
      if (n.userId === userId || n.userId === "broadcast") n.read = true;
    });
    setNotifications(notifications);
    return Promise.resolve(notifications);
  }
  return Promise.resolve([]);
};

// Convenience: send to multiple roles (admin, collector, staff)
export const createRoleNotification = async ({ role, title, message, type, link }) => {
  // Lightweight: only fire for mock mode.
  const all = usersStore.all();
  const targets = (all || []).filter((u) => u.role === role);
  const created = [];
  targets.forEach((u) => {
    created.push(createNotification({ userId: u.id, title, message, type, link }));
  });
  return Promise.all(created);
};
