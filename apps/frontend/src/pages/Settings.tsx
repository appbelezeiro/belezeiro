import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { PersonalProfileSettings } from "@/components/settings/PersonalProfileSettings";
import { BusinessSettings } from "@/components/settings/BusinessSettings";
import { ProfessionalProfileSettings } from "@/components/settings/ProfessionalProfileSettings";
import { PublicSiteSettings } from "@/components/settings/PublicSiteSettings";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { OnlineSecretarySettings } from "@/components/settings/OnlineSecretarySettings";

type SettingsSection = 
  | "personal-profile"
  | "business"
  | "professional-profile"
  | "public-site"
  | "billing"
  | "online-secretary";

const Settings = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>("personal-profile");

  const renderContent = () => {
    switch (activeSection) {
      case "personal-profile":
        return <PersonalProfileSettings />;
      case "business":
        return <BusinessSettings />;
      case "professional-profile":
        return <ProfessionalProfileSettings />;
      case "public-site":
        return <PublicSiteSettings />;
      case "billing":
        return <BillingSettings />;
      case "online-secretary":
        return <OnlineSecretarySettings />;
      default:
        return <PersonalProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeNav="configuracoes" />
      
      <main className="content-container py-6">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Configurações</h1>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Menu */}
          <div className="lg:w-64 flex-shrink-0">
            <SettingsSidebar 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
          </div>
          
          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-card rounded-lg border border-border shadow-soft overflow-hidden">
              <div className="p-6 lg:p-8 max-h-[calc(100vh-220px)] overflow-y-auto">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
