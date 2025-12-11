import { User, Building2, Briefcase, CreditCard, Bot, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsSection = 
  | "personal-profile"
  | "business"
  | "professional-profile"
  | "public-site"
  | "billing"
  | "online-secretary";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const menuItems: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: "personal-profile", label: "Meu perfil pessoal", icon: User },
  { id: "business", label: "Meu negócio", icon: Building2 },
  { id: "professional-profile", label: "Meu perfil profissional", icon: Briefcase },
  { id: "public-site", label: "Site público", icon: Globe },
  { id: "billing", label: "Cobrança e assinatura", icon: CreditCard },
  { id: "online-secretary", label: "Secretário online", icon: Bot },
];

export const SettingsSidebar = ({ activeSection, onSectionChange }: SettingsSidebarProps) => {
  return (
    <nav className="bg-card rounded-lg border border-border shadow-soft p-2">
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
