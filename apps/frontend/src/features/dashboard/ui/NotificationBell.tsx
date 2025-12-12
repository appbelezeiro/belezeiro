import { useState } from "react";
import { Bell, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "../api/dashboard.service";
import type { DashboardNotification } from "../types";

type NotificationType = "appointment" | "message" | "reminder" | "system" | "payment";

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `Ha ${diffMins} min`;
  if (diffHours < 24) return `Ha ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  if (diffDays === 1) return "Ontem";
  return `Ha ${diffDays} dias`;
}

function getTypeColor(type: string): string {
  switch (type as NotificationType) {
    case "appointment":
      return "bg-emerald-500";
    case "payment":
      return "bg-amber-500";
    case "message":
      return "bg-blue-500";
    case "reminder":
      return "bg-purple-500";
    case "system":
    default:
      return "bg-primary";
  }
}

function NotificationListSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between p-3 border-b border-border">
        <span className="font-medium text-sm">Notificacoes</span>
      </div>
      <div className="p-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3">
            <div className="flex gap-3">
              <div className="h-2 w-2 rounded-full bg-muted animate-pulse mt-2" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-48 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function NotificationList({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  isMarkingRead,
  isMarkingAllRead,
}: {
  notifications: DashboardNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  isMarkingRead: boolean;
  isMarkingAllRead: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between p-3 border-b border-border">
        <span className="font-medium text-sm">Notificacoes</span>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-auto p-1"
            onClick={onMarkAllAsRead}
            disabled={isMarkingAllRead}
          >
            {isMarkingAllRead ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : null}
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <ScrollArea className="max-h-[350px]">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notificacao</p>
          </div>
        ) : (
          <div className="p-1">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => !notification.read && onMarkAsRead(notification.id)}
                disabled={isMarkingRead}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  notification.read
                    ? "hover:bg-secondary/50"
                    : "bg-primary/5 hover:bg-primary/10"
                )}
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                      getTypeColor(notification.type)
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm truncate",
                          !notification.read && "font-medium"
                        )}
                      >
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </>
  );
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const {
    data: notificationsData,
    isLoading,
  } = useQuery({
    queryKey: ["dashboard", "notifications"],
    queryFn: () => dashboardService.getNotifications(20),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      dashboardService.markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => dashboardService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] });
    },
  });

  const notifications = notificationsData?.items ?? [];
  const unreadCount = notificationsData?.unreadCount ?? 0;

  const handleMarkAsRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  const TriggerButton = (
    <Button variant="ghost" size="icon" className="relative h-9 w-9">
      <Bell className="h-5 w-5 text-muted-foreground" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  );

  const content = isLoading ? (
    <NotificationListSkeleton />
  ) : (
    <NotificationList
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      isMarkingRead={markReadMutation.isPending}
      isMarkingAllRead={markAllReadMutation.isPending}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
        <SheetContent side="top" className="h-full">
          <SheetHeader className="flex flex-row items-center justify-between pr-0">
            <SheetTitle>Notificacoes</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </SheetHeader>
          <div className="mt-4">{content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        {content}
      </PopoverContent>
    </Popover>
  );
}
