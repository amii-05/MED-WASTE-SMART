import { createContext, useContext, useMemo } from "react";
import { useAppData } from "./AppDataContext";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppData();
  const { user } = useAuth();

  // Only surface notifications that belong to the logged-in user (or that are
  // broadcast to everyone). This keeps each role's bell/toasts scoped correctly.
  const myNotifications = useMemo(() => {
    const uid = user?.id;
    if (!uid) return [];
    return notifications.filter(
      (n) => n.userId === uid || n.userId === "broadcast"
    );
  }, [notifications, user]);

  const unreadCount = useMemo(
    () => myNotifications.filter((n) => !n.read).length,
    [myNotifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications: myNotifications,
        unreadCount,
        markRead: markNotificationRead,
        markAllRead: markAllNotificationsRead,
        reload: () => {},
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};

export default NotificationContext;

