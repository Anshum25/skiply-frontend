import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Notification, NotificationContextType } from "../types";

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_ALL" }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] };

const notificationReducer = (
  state: NotificationState,
  action: NotificationAction,
): NotificationState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification,
        ),
      };
    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload,
        ),
      };
    case "CLEAR_ALL":
      return {
        ...state,
        notifications: [],
      };
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
      };
    default:
      return state;
  }
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
  });

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("skiply_notifications");
    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications);
        dispatch({ type: "SET_NOTIFICATIONS", payload: notifications });
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "skiply_notifications",
      JSON.stringify(state.notifications),
    );
  }, [state.notifications]);

  // Clean up expired notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      const validNotifications = state.notifications.filter(
        (notification) =>
          !notification.expiresAt || notification.expiresAt > now,
      );

      if (validNotifications.length !== state.notifications.length) {
        dispatch({ type: "SET_NOTIFICATIONS", payload: validNotifications });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [state.notifications]);

  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });
  };

  const markAsRead = (notificationId: string) => {
    dispatch({ type: "MARK_AS_READ", payload: notificationId });
  };

  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_AS_READ" });
  };

  const removeNotification = (notificationId: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: notificationId });
  };

  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  const unreadCount = state.notifications.filter((n) => !n.isRead).length;

  const value: NotificationContextType = {
    notifications: state.notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
