import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ReferralBanner } from "@/components/dashboard/ReferralBanner";
import { KPICards } from "@/components/dashboard/KPICards";
import { AppointmentsList } from "@/components/dashboard/AppointmentsList";
import { SecretaryStatusCard } from "@/components/dashboard/SecretaryStatusCard";
import { PlanStatusCard } from "@/components/dashboard/PlanStatusCard";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      {/* Main Content */}
      <main className="content-container py-6">
        {/* Referral Banner */}
        <div className="mb-6">
          <ReferralBanner />
        </div>

        <div className={`flex gap-6 ${isMobile ? 'flex-col' : ''}`}>
          {/* Central Column */}
          <div className="flex-1 space-y-6">
            {/* KPIs */}
            <KPICards />

            {/* Appointments List */}
            <AppointmentsList />
          </div>

          {/* Right Column - Sidebar Cards */}
          <div className={`space-y-6 ${isMobile ? 'order-first' : 'w-80 flex-shrink-0'}`}>
            <SecretaryStatusCard />
            <PlanStatusCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
