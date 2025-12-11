import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut, LifeBuoy, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const mockUser = {
  name: "João Silva",
  role: "Dono",
  avatar: "",
  initials: "JS",
};

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-2 -mr-2 rounded-xl hover:bg-secondary/50 transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {mockUser.initials}
            </AvatarFallback>
          </Avatar>
          {!isMobile && (
            <>
              <div className="text-left">
                <span className="block text-sm font-medium text-foreground">
                  {mockUser.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {mockUser.role}
                </span>
              </div>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )} 
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-card border border-border shadow-card"
        sideOffset={8}
      >
        <div className="px-3 py-3 border-b border-border">
          <p className="font-medium text-foreground">{mockUser.name}</p>
          <p className="text-xs text-muted-foreground">{mockUser.role}</p>
        </div>

        <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 cursor-pointer">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Meu Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
          onClick={() => navigate("/ajuda-suporte")}
        >
          <LifeBuoy className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Ajuda e Suporte</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            toggleTheme();
          }}
        >
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Moon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Sun className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm">Tema</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn(theme !== "dark" && "text-foreground font-medium")}>Light</span>
            <span>/</span>
            <span className={cn(theme === "dark" && "text-foreground font-medium")}>Dark</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};