// ============================================================================
// UNIT CONTEXT - Unit Selection State Management
// ============================================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import { useAuth } from "./AuthContext";

// ============================================================================
// Types
// ============================================================================

export interface Unit {
  id: string;
  name: string;
  brandColor?: string;
  logo?: string;
  isActive?: boolean;
}

export interface Organization {
  id: string;
  businessName: string;
}

export interface UnitContextType {
  units: Unit[];
  selectedUnit: Unit | null;
  organization: Organization | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  setSelectedUnit: (unit: Unit) => void;
  refetchUnits: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "belezeiro_selected_unit";
const apiClient = createApiClient();

// ============================================================================
// LocalStorage Helpers (Safe)
// ============================================================================

function getStoredUnitId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage not available (private mode, etc.)
    return null;
  }
}

function setStoredUnitId(unitId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, unitId);
  } catch {
    // localStorage not available
    console.warn("[UnitContext] Could not persist unit selection to localStorage");
  }
}

function clearStoredUnitId(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}

// ============================================================================
// Context
// ============================================================================

const UnitContext = createContext<UnitContextType | undefined>(undefined);

// ============================================================================
// Provider Props
// ============================================================================

interface UnitProviderProps {
  children: ReactNode;
}

// ============================================================================
// Provider Component
// ============================================================================

export function UnitProvider({ children }: UnitProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [selectedUnit, setSelectedUnitState] = useState<Unit | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  // Fetch organization by owner
  const {
    data: orgData,
    isLoading: isOrgLoading,
    isError: isOrgError,
    error: orgError,
  } = useQuery({
    queryKey: ["organization", "owner", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await apiClient.get<{ id: string; name: string }>(
        API_ENDPOINTS.ORGANIZATIONS.BY_OWNER(user.id)
      );
      return response.data;
    },
    enabled: isAuthenticated && !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });

  // Update organization state when data changes
  useEffect(() => {
    if (orgData) {
      setOrganization({
        id: orgData.id,
        businessName: orgData.name,
      });
    }
  }, [orgData]);

  // Fetch units by organization
  const {
    data: unitsData,
    isLoading: isUnitsLoading,
    isError: isUnitsError,
    error: unitsError,
    refetch: refetchUnits,
  } = useQuery({
    queryKey: ["units", "organization", organization?.id],
    queryFn: async () => {
      if (!organization?.id) return { items: [], total: 0 };
      const response = await apiClient.get<{ items: Unit[]; total: number }>(
        API_ENDPOINTS.UNITS.BY_ORGANIZATION(organization.id)
      );
      return response.data;
    },
    enabled: !!organization?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const units = useMemo(() => unitsData?.items ?? [], [unitsData]);

  // Initialize selected unit from localStorage or first unit
  useEffect(() => {
    if (units.length === 0) {
      setSelectedUnitState(null);
      return;
    }

    const storedUnitId = getStoredUnitId();

    if (storedUnitId) {
      // Try to find the stored unit in the current units list
      const storedUnit = units.find((u) => u.id === storedUnitId);
      if (storedUnit) {
        setSelectedUnitState(storedUnit);
        return;
      }
      // Stored unit not found in current list, clear it
      clearStoredUnitId();
    }

    // Default to first unit
    setSelectedUnitState(units[0]);
    setStoredUnitId(units[0].id);
  }, [units]);

  // Set selected unit with persistence
  const setSelectedUnit = useCallback((unit: Unit) => {
    setSelectedUnitState(unit);
    setStoredUnitId(unit.id);
  }, []);

  // Clear stored unit on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedUnitState(null);
      setOrganization(null);
      clearStoredUnitId();
    }
  }, [isAuthenticated]);

  // Combined loading and error states
  const isLoading = isOrgLoading || isUnitsLoading;
  const isError = isOrgError || isUnitsError;
  const error = (orgError || unitsError) as Error | null;

  const value: UnitContextType = useMemo(
    () => ({
      units,
      selectedUnit,
      organization,
      isLoading,
      isError,
      error,
      setSelectedUnit,
      refetchUnits,
    }),
    [units, selectedUnit, organization, isLoading, isError, error, setSelectedUnit, refetchUnits]
  );

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to access unit context
 * Must be used within UnitProvider
 */
export function useUnit(): UnitContextType {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error("useUnit must be used within a UnitProvider");
  }

  return context;
}

/**
 * Hook to get selected unit
 * Convenience hook that extracts just the selected unit
 */
export function useSelectedUnit(): Unit | null {
  const { selectedUnit } = useUnit();
  return selectedUnit;
}

/**
 * Hook to get all units
 * Convenience hook that extracts just the units list
 */
export function useUnits(): Unit[] {
  const { units } = useUnit();
  return units;
}

/**
 * Hook to get organization
 * Convenience hook that extracts just the organization
 */
export function useOrganization(): Organization | null {
  const { organization } = useUnit();
  return organization;
}
