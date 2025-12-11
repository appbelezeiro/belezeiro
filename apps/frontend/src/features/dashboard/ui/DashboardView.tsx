import { DashboardHeader } from "./DashboardHeader";
import { ReferralBanner } from "./ReferralBanner";
import { KPICards } from "./KPICards";
import { AppointmentsList } from "./AppointmentsList";
import { SecretaryStatusCard } from "./SecretaryStatusCard";
import { PlanStatusCard } from "./PlanStatusCard";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardView() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="content-container py-6">
        <div className="mb-6">
          <ReferralBanner />
        </div>

        <div className={`flex gap-6 ${isMobile ? "flex-col" : ""}`}>
          <div className="flex-1 space-y-6">
            <KPICards />
            <AppointmentsList />
          </div>

          <div className={`space-y-6 ${isMobile ? "order-first" : "w-80 flex-shrink-0"}`}>
            <SecretaryStatusCard />
            <PlanStatusCard />
          </div>
        </div>
      </main>
    </div>
  );
}
