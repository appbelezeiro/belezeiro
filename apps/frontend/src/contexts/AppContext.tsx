import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type PlanType = "free" | "pro";
type FlowType = "cadastro" | "multiplas-unidades" | "dashboard";

interface EmptyStates {
  invoices: boolean;
  appointments: boolean;
  customers: boolean;
  referrals: boolean;
  allowNewReferralLink: boolean;
  tickets: boolean;
}

interface AppContextType {
  plan: PlanType;
  setPlan: (plan: PlanType) => void;
  isPro: boolean;
  flow: FlowType;
  setFlow: (flow: FlowType) => void;
  emptyStates: EmptyStates;
  setEmptyState: (key: keyof EmptyStates, value: boolean) => void;
  toggleAllEmptyStates: (value: boolean) => void;
  publicDarkMode: boolean;
  setPublicDarkMode: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<PlanType>("pro");
  const [flow, setFlow] = useState<FlowType>("cadastro");
  const [publicDarkMode, setPublicDarkMode] = useState(false);
  const [emptyStates, setEmptyStates] = useState<EmptyStates>({
    invoices: false,
    appointments: false,
    customers: false,
    referrals: false,
    allowNewReferralLink: false,
    tickets: false,
  });

  const setEmptyState = (key: keyof EmptyStates, value: boolean) => {
    setEmptyStates((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAllEmptyStates = (value: boolean) => {
    setEmptyStates(prev => ({
      invoices: value,
      appointments: value,
      customers: value,
      referrals: value,
      tickets: value,
      allowNewReferralLink: prev.allowNewReferralLink,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        plan,
        setPlan,
        isPro: plan === "pro",
        flow,
        setFlow,
        emptyStates,
        setEmptyState,
        toggleAllEmptyStates,
        publicDarkMode,
        setPublicDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

// Re-export for backwards compatibility
export const usePlan = () => {
  const { plan, setPlan, isPro } = useApp();
  return { plan, setPlan, isPro };
};

export const useEmptyStates = () => {
  const { emptyStates, setEmptyState, toggleAllEmptyStates } = useApp();
  return { emptyStates, setEmptyState, toggleAllEmptyStates };
};
