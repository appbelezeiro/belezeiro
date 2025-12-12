/**
 * Onboarding Persistence Service
 *
 * Specialized persistence layer for the onboarding flow that:
 * - Persists form data and step progress with 24h TTL
 * - Associates data with user ID for multi-user support
 * - Auto-saves on form updates
 * - Cleans up on successful completion
 */

import { StorageGateway } from './storage-gateway';

// 24 hours TTL for onboarding data
const ONBOARDING_TTL = 24 * 60 * 60 * 1000;
const ONBOARDING_STORAGE_PREFIX = 'belezeiro_onboarding_';

export interface OnboardingPersistedData {
  // Current step (1-7)
  currentStep: number;

  // Form data
  formData: {
    // Business
    businessName: string;

    // Unit Basic Info
    unitName: string;
    logo: string | null;
    gallery: string[];
    whatsapp: string;
    phone: string;

    // Address
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    number: string;
    complement: string;

    // Specialties & Services
    especialidades: { id: string; name: string; icon: string }[];
    services: { name: string; especialidadeId: string }[];

    // Service Type
    serviceType: 'local' | 'home' | 'both' | null;

    // Amenities
    amenities: string[];

    // Working Hours
    workingHours: Record<string, { open: string; close: string; enabled: boolean }>;
    lunchBreak: { enabled: boolean; start: string; end: string };

    // Personalization
    brandColor: string;
  };

  // Metadata
  lastUpdatedAt: number;
  startedAt: number;
}

export interface OnboardingPersistenceMetadata {
  expiresAt: number;
  remainingTime: number;
  remainingTimeFormatted: string;
  startedAt: number;
  lastUpdatedAt: number;
}

class OnboardingPersistenceService {
  private gateway: StorageGateway<OnboardingPersistedData>;

  constructor() {
    this.gateway = new StorageGateway<OnboardingPersistedData>({
      ttl: ONBOARDING_TTL,
      prefix: ONBOARDING_STORAGE_PREFIX,
    });

    // Clean up expired items on initialization
    this.gateway.cleanupExpired();
  }

  /**
   * Generate storage key for a specific user
   */
  private getUserKey(userId: string): string {
    return `user_${userId}`;
  }

  /**
   * Save onboarding progress for a user
   */
  save(userId: string, data: Partial<OnboardingPersistedData>): boolean {
    const existing = this.get(userId);
    const now = Date.now();

    const mergedData: OnboardingPersistedData = {
      currentStep: data.currentStep ?? existing?.currentStep ?? 1,
      formData: {
        ...(existing?.formData ?? this.getDefaultFormData()),
        ...(data.formData ?? {}),
      },
      lastUpdatedAt: now,
      startedAt: existing?.startedAt ?? now,
    };

    return this.gateway.save(this.getUserKey(userId), mergedData);
  }

  /**
   * Save only the current step
   */
  saveStep(userId: string, step: number): boolean {
    return this.save(userId, { currentStep: step });
  }

  /**
   * Save only form data (partial update)
   */
  saveFormData(userId: string, formData: Partial<OnboardingPersistedData['formData']>): boolean {
    const existing = this.get(userId);
    return this.save(userId, {
      formData: {
        ...(existing?.formData ?? this.getDefaultFormData()),
        ...formData,
      },
    });
  }

  /**
   * Get persisted onboarding data for a user
   */
  get(userId: string): OnboardingPersistedData | null {
    return this.gateway.get(this.getUserKey(userId));
  }

  /**
   * Get persisted data with expiration metadata
   */
  getWithMetadata(userId: string): { data: OnboardingPersistedData; metadata: OnboardingPersistenceMetadata } | null {
    const result = this.gateway.getWithMetadata(this.getUserKey(userId));

    if (!result) {
      return null;
    }

    return {
      data: result.data,
      metadata: {
        expiresAt: result.expiresAt,
        remainingTime: result.remainingTime,
        remainingTimeFormatted: this.formatRemainingTime(result.remainingTime),
        startedAt: result.data.startedAt,
        lastUpdatedAt: result.data.lastUpdatedAt,
      },
    };
  }

  /**
   * Check if user has persisted onboarding data
   */
  exists(userId: string): boolean {
    return this.gateway.exists(this.getUserKey(userId));
  }

  /**
   * Clear persisted data for a user (call on successful completion)
   */
  clear(userId: string): boolean {
    return this.gateway.remove(this.getUserKey(userId));
  }

  /**
   * Refresh TTL for user's onboarding data
   */
  refreshTTL(userId: string): boolean {
    return this.gateway.refreshTTL(this.getUserKey(userId));
  }

  /**
   * Get remaining time before expiration
   */
  getRemainingTime(userId: string): number | null {
    return this.gateway.getRemainingTime(this.getUserKey(userId));
  }

  /**
   * Get default form data structure
   */
  private getDefaultFormData(): OnboardingPersistedData['formData'] {
    return {
      businessName: '',
      unitName: '',
      logo: null,
      gallery: [],
      whatsapp: '',
      phone: '',
      cep: '',
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      number: '',
      complement: '',
      professions: [],
      services: [],
      serviceType: null,
      amenities: [],
      workingHours: {
        monday: { open: '09:00', close: '18:00', enabled: true },
        tuesday: { open: '09:00', close: '18:00', enabled: true },
        wednesday: { open: '09:00', close: '18:00', enabled: true },
        thursday: { open: '09:00', close: '18:00', enabled: true },
        friday: { open: '09:00', close: '18:00', enabled: true },
        saturday: { open: '09:00', close: '13:00', enabled: true },
        sunday: { open: '09:00', close: '18:00', enabled: false },
      },
      lunchBreak: { enabled: false, start: '12:00', end: '13:00' },
      brandColor: '#3b82f6',
    };
  }

  /**
   * Format remaining time to human-readable string
   */
  private formatRemainingTime(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }

  /**
   * Clean up all expired onboarding data
   */
  cleanupExpired(): number {
    return this.gateway.cleanupExpired();
  }
}

// Export singleton instance
export const onboardingPersistence = new OnboardingPersistenceService();
