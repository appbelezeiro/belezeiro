/**
 * Storage Gateway with TTL Support
 *
 * A generic persistence gateway that provides:
 * - TTL-based expiration (configurable)
 * - Automatic cleanup of expired data
 * - Type-safe storage operations
 * - Support for localStorage with fallback
 */

interface StorageItem<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
  updatedAt: number;
}

interface StorageGatewayOptions {
  /** Time to live in milliseconds. Default: 24 hours */
  ttl?: number;
  /** Storage key prefix for namespacing */
  prefix?: string;
  /** Storage backend (localStorage by default) */
  storage?: Storage;
}

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const DEFAULT_PREFIX = 'belezeiro_';

export class StorageGateway<T = unknown> {
  private readonly ttl: number;
  private readonly prefix: string;
  private readonly storage: Storage;

  constructor(options: StorageGatewayOptions = {}) {
    this.ttl = options.ttl ?? DEFAULT_TTL;
    this.prefix = options.prefix ?? DEFAULT_PREFIX;
    this.storage = options.storage ?? (typeof window !== 'undefined' ? window.localStorage : null!);
  }

  /**
   * Generate the full storage key with prefix
   */
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Check if an item has expired
   */
  private isExpired(item: StorageItem<T>): boolean {
    return Date.now() > item.expiresAt;
  }

  /**
   * Save data to storage with TTL
   */
  save(key: string, data: T): boolean {
    if (!this.storage) {
      console.warn('StorageGateway: Storage not available');
      return false;
    }

    try {
      const now = Date.now();
      const existingItem = this.getRawItem(key);

      const item: StorageItem<T> = {
        data,
        expiresAt: now + this.ttl,
        createdAt: existingItem?.createdAt ?? now,
        updatedAt: now,
      };

      this.storage.setItem(this.getFullKey(key), JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('StorageGateway: Failed to save data', error);
      return false;
    }
  }

  /**
   * Update data partially (merge with existing data)
   */
  update(key: string, partialData: Partial<T>): boolean {
    const existingData = this.get(key);
    if (existingData === null) {
      // If no existing data, save as new
      return this.save(key, partialData as T);
    }

    const mergedData = { ...existingData, ...partialData };
    return this.save(key, mergedData);
  }

  /**
   * Get raw storage item (including metadata)
   */
  private getRawItem(key: string): StorageItem<T> | null {
    if (!this.storage) {
      return null;
    }

    try {
      const raw = this.storage.getItem(this.getFullKey(key));
      if (!raw) {
        return null;
      }

      return JSON.parse(raw) as StorageItem<T>;
    } catch {
      return null;
    }
  }

  /**
   * Retrieve data from storage (returns null if expired or not found)
   */
  get(key: string): T | null {
    const item = this.getRawItem(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (this.isExpired(item)) {
      this.remove(key);
      return null;
    }

    return item.data;
  }

  /**
   * Get data with metadata (expiration info)
   */
  getWithMetadata(key: string): { data: T; expiresAt: number; remainingTime: number } | null {
    const item = this.getRawItem(key);

    if (!item) {
      return null;
    }

    if (this.isExpired(item)) {
      this.remove(key);
      return null;
    }

    return {
      data: item.data,
      expiresAt: item.expiresAt,
      remainingTime: item.expiresAt - Date.now(),
    };
  }

  /**
   * Check if a key exists and is not expired
   */
  exists(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove a specific key from storage
   */
  remove(key: string): boolean {
    if (!this.storage) {
      return false;
    }

    try {
      this.storage.removeItem(this.getFullKey(key));
      return true;
    } catch (error) {
      console.error('StorageGateway: Failed to remove data', error);
      return false;
    }
  }

  /**
   * Clear all items with this prefix (namespace)
   */
  clearAll(): boolean {
    if (!this.storage) {
      return false;
    }

    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => this.storage.removeItem(key));
      return true;
    } catch (error) {
      console.error('StorageGateway: Failed to clear all data', error);
      return false;
    }
  }

  /**
   * Clean up all expired items in this namespace
   */
  cleanupExpired(): number {
    if (!this.storage) {
      return 0;
    }

    let cleanedCount = 0;
    const keysToCheck: string[] = [];

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToCheck.push(key);
      }
    }

    keysToCheck.forEach((fullKey) => {
      try {
        const raw = this.storage.getItem(fullKey);
        if (raw) {
          const item = JSON.parse(raw) as StorageItem<unknown>;
          if (Date.now() > item.expiresAt) {
            this.storage.removeItem(fullKey);
            cleanedCount++;
          }
        }
      } catch {
        // If we can't parse it, it's probably corrupted, remove it
        this.storage.removeItem(fullKey);
        cleanedCount++;
      }
    });

    return cleanedCount;
  }

  /**
   * Refresh the TTL of an existing item
   */
  refreshTTL(key: string): boolean {
    const data = this.get(key);
    if (data === null) {
      return false;
    }
    return this.save(key, data);
  }

  /**
   * Get the remaining time in milliseconds for an item
   */
  getRemainingTime(key: string): number | null {
    const item = this.getRawItem(key);
    if (!item || this.isExpired(item)) {
      return null;
    }
    return item.expiresAt - Date.now();
  }
}

/**
 * Create a storage gateway with default settings
 */
export function createStorageGateway<T>(options?: StorageGatewayOptions): StorageGateway<T> {
  return new StorageGateway<T>(options);
}
