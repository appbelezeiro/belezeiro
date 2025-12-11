import { useState } from "react";
import { Menu } from "lucide-react";
import { UnitSelector } from "./UnitSelector";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "./NotificationBell";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { label: "Painel", href: "/dashboard", key: "painel" },
  { label: "Agenda", href: "/agenda", key: "agenda" },
  { label: "Clientes", href: "/clientes", key: "clientes" },
  { label: "Serviços", href: "/servicos", key: "servicos" },
  { label: "Configurações", href: "/configuracoes", key: "configuracoes" },
];

interface DashboardHeaderProps {
  activeNav?: "painel" | "agenda" | "clientes" | "servicos" | "configuracoes";
}

export function DashboardHeader({ activeNav = "painel" }: DashboardHeaderProps) {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="content-container">
        <div className="flex items-center justify-between h-16">
          <UnitSelector />

          {!isMobile && (
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    item.key === activeNav
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1">
            <NotificationBell />
            {isMobile && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 mt-6">
                    {navItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          item.key === activeNav
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
