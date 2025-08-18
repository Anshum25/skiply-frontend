import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Bell,
  CheckCircle,
  Clock,
  X,
  MessageSquare,
  Star,
  AlertTriangle,
  Info,
  Trash2,
  MarkAsUnread,
} from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";
import { Notification, NotificationType } from "../../types";
import { cn } from "../../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationDrawerProps {
  children: React.ReactNode;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  children,
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "booking_confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "booking_cancelled":
        return <X className="w-5 h-5 text-red-500" />;
      case "queue_update":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "turn_approaching":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "business_message":
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case "review_request":
        return <Star className="w-5 h-5 text-yellow-500" />;
      case "promotion":
        return <Info className="w-5 h-5 text-pink-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "booking_confirmed":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
      case "booking_cancelled":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
      case "queue_update":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
      case "turn_approaching":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
      case "business_message":
        return "border-l-purple-500 bg-purple-50 dark:bg-purple-950/20";
      case "review_request":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
      case "promotion":
        return "border-l-pink-500 bg-pink-50 dark:bg-pink-950/20";
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md glass">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="notification-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-full pb-20 mt-6">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <Bell className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No notifications
                </h3>
                <p className="text-sm text-muted-foreground/75">
                  You're all caught up! New notifications will appear here.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                      getNotificationColor(notification.type),
                      !notification.isRead && "ring-2 ring-primary/20",
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={cn(
                              "text-sm font-medium leading-5",
                              !notification.isRead && "font-semibold",
                            )}
                          >
                            {notification.title}
                          </h4>

                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-1 leading-5">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              },
                            )}
                          </span>

                          {notification.data?.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle action navigation
                              }}
                            >
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
