import { useState } from "react";
import { Menu, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PublicHeaderProps {
  businessName: string;
  logo: string | null;
  primaryColor: string;
  isBookingEnabled: boolean;
  onNavigate: (section: string) => void;
  activeSection: string;
}

const navItems = [
  { id: "home", label: "Início" },
  { id: "services", label: "Serviços" },
  { id: "hours", label: "Horários" },
  { id: "location", label: "Localização" },
];

export const PublicHeader = ({
  businessName,
  logo,
  primaryColor,
  isBookingEnabled,
  onNavigate,
  activeSection,
}: PublicHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (section: string) => {
    onNavigate(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => handleNavigate("home")} className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt={businessName} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {businessName.charAt(0)}
              </div>
            )}
            <span className="font-semibold text-foreground hidden sm:block">{businessName}</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeSection === item.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isBookingEnabled && (
              <Button 
                className="hidden sm:flex gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                <Calendar className="h-4 w-4" />
                Agendar
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                    activeSection === item.id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.label}
                </button>
              ))}
              {isBookingEnabled && (
                <Button 
                  className="mt-2 gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Calendar className="h-4 w-4" />
                  Agendar agora
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
