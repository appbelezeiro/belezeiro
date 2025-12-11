import { useState } from "react";
import { Bell, X } from "lucide-react";
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

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Novo agendamento",
    message: "Maria Silva agendou um horário para amanhã às 14:00",
    time: "Há 5 min",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "Lembrete",
    message: "Você tem 3 agendamentos para hoje",
    time: "Há 1 hora",
    read: false,
    type: "info",
  },
  {
    id: "3",
    title: "Cancelamento",
    message: "João Pedro cancelou o agendamento de hoje às 16:00",
    time: "Há 2 horas",
    read: true,
    type: "warning",
  },
  {
    id: "4",
    title: "Nova avaliação",
    message: "Você recebeu uma avaliação 5 estrelas de Ana Costa",
    time: "Ontem",
    read: true,
    type: "success",
  },
];

const NotificationList = ({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: { 
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "bg-emerald-500";
      case "warning": return "bg-amber-500";
      default: return "bg-primary";
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 border-b border-border">
        <span className="font-medium text-sm">Notificações</span>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground h-auto p-1"
            onClick={onMarkAllAsRead}
          >
            Marcar todas como lidas
          </Button>
        )}
      </div>
      
      <ScrollArea className="max-h-[350px]">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="p-1">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => onMarkAsRead(notification.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  notification.read 
                    ? "hover:bg-secondary/50" 
                    : "bg-primary/5 hover:bg-primary/10"
                )}
              >
                <div className="flex gap-3">
                  <div className={cn(
                    "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                    getTypeColor(notification.type)
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        "text-sm truncate",
                        !notification.read && "font-medium"
                      )}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {notification.time}
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
};

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const isMobile = useIsMobile();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const TriggerButton = (
    <Button variant="ghost" size="icon" className="relative h-9 w-9">
      <Bell className="h-5 w-5 text-muted-foreground" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Button>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {TriggerButton}
        </SheetTrigger>
        <SheetContent side="top" className="h-full">
          <SheetHeader className="flex flex-row items-center justify-between pr-0">
            <SheetTitle>Notificações</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </SheetClose>
          </SheetHeader>
          <div className="mt-4">
            <NotificationList 
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {TriggerButton}
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 p-0"
        sideOffset={8}
      >
        <NotificationList 
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      </PopoverContent>
    </Popover>
  );
};
