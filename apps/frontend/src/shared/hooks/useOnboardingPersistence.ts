/**
 * useOnboardingPersistence Hook
 *
 * React hook for managing onboarding form persistence with:
 * - Auto-save on form data changes (debounced)
 * - Auto-restore on component mount
 * - TTL-based expiration (24h)
 * - Cleanup on successful completion
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  onboardingPersistence,
  type OnboardingPersistedData,
  type OnboardingPersistenceMetadata,
} from '../lib/persistence';

interface UseOnboardingPersistenceOptions {
  /** User ID for associating persisted data */
  userId: string | undefined;
  /** Debounce delay for auto-save in ms (default: 500ms) */
  debounceMs?: number;
  /** Callback when data is restored */
  onRestore?: (data: OnboardingPersistedData) => void;
}

interface UseOnboardingPersistenceReturn {
  /** Save current form state */
  save: (data: Partial<OnboardingPersistedData>) => void;
  /** Save only form data */
  saveFormData: (formData: Partial<OnboardingPersistedData['formData']>) => void;
  /** Save only current step */
  saveStep: (step: number) => void;
  /** Get persisted data */
  getData: () => OnboardingPersistedData | null;
  /** Clear all persisted data (call on completion) */
  clear: () => void;
  /** Check if persisted data exists */
  hasSavedData: boolean;
  /** Persistence metadata (expiration, remaining time) */
  metadata: OnboardingPersistenceMetadata | null;
  /** Initial data loaded from persistence */
  initialData: OnboardingPersistedData | null;
  /** Whether data has been loaded */
  isLoaded: boolean;
}

export function useOnboardingPersistence({
  userId,
  debounceMs = 500,
  onRestore,
}: UseOnboardingPersistenceOptions): UseOnboardingPersistenceReturn {
  const [hasSavedData, setHasSavedData] = useState(false);
  const [metadata, setMetadata] = useState<OnboardingPersistenceMetadata | null>(null);
  const [initialData, setInitialData] = useState<OnboardingPersistedData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onRestoreRef = useRef(onRestore);

  // Keep onRestore callback ref updated
  useEffect(() => {
    onRestoreRef.current = onRestore;
  }, [onRestore]);

  // Load persisted data on mount
  useEffect(() => {
    if (!userId) {
      setIsLoaded(true);
      return;
    }

    const result = onboardingPersistence.getWithMetadata(userId);

    if (result) {
      setHasSavedData(true);
      setMetadata(result.metadata);
      setInitialData(result.data);

      // Call restore callback
      if (onRestoreRef.current) {
        onRestoreRef.current(result.data);
      }
    } else {
      setHasSavedData(false);
      setMetadata(null);
      setInitialData(null);
    }

    setIsLoaded(true);
  }, [userId]);

  // Update metadata periodically (every minute)
  useEffect(() => {
    if (!userId || !hasSavedData) return;

    const updateMetadata = () => {
      const result = onboardingPersistence.getWithMetadata(userId);
      if (result) {
        setMetadata(result.metadata);
      } else {
        // Data expired
        setHasSavedData(false);
        setMetadata(null);
      }
    };

    const interval = setInterval(updateMetadata, 60000);
    return () => clearInterval(interval);
  }, [userId, hasSavedData]);

  // Debounced save function
  const debouncedSave = useCallback(
    (saveFn: () => void) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        saveFn();
      }, debounceMs);
    },
    [debounceMs]
  );

  // Save complete data
  const save = useCallback(
    (data: Partial<OnboardingPersistedData>) => {
      if (!userId) return;

      debouncedSave(() => {
        const success = onboardingPersistence.save(userId, data);
        if (success) {
          setHasSavedData(true);
          // Update metadata after save
          const result = onboardingPersistence.getWithMetadata(userId);
          if (result) {
            setMetadata(result.metadata);
          }
        }
      });
    },
    [userId, debouncedSave]
  );

  // Save only form data
  const saveFormData = useCallback(
    (formData: Partial<OnboardingPersistedData['formData']>) => {
      if (!userId) return;

      debouncedSave(() => {
        const success = onboardingPersistence.saveFormData(userId, formData);
        if (success) {
          setHasSavedData(true);
          const result = onboardingPersistence.getWithMetadata(userId);
          if (result) {
            setMetadata(result.metadata);
          }
        }
      });
    },
    [userId, debouncedSave]
  );

  // Save only step (immediate, no debounce)
  const saveStep = useCallback(
    (step: number) => {
      if (!userId) return;

      const success = onboardingPersistence.saveStep(userId, step);
      if (success) {
        setHasSavedData(true);
      }
    },
    [userId]
  );

  // Get current persisted data
  const getData = useCallback((): OnboardingPersistedData | null => {
    if (!userId) return null;
    return onboardingPersistence.get(userId);
  }, [userId]);

  // Clear persisted data
  const clear = useCallback(() => {
    if (!userId) return;

    // Cancel any pending saves
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    onboardingPersistence.clear(userId);
    setHasSavedData(false);
    setMetadata(null);
    setInitialData(null);
  }, [userId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    save,
    saveFormData,
    saveStep,
    getData,
    clear,
    hasSavedData,
    metadata,
    initialData,
    isLoaded,
  };
}
