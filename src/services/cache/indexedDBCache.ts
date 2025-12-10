/**
 * IndexedDB Cache
 *
 * Generic, typed IndexedDB cache for persistent client-side storage.
 * Replaces duplicate implementations in avatarCache.ts and useAvatarLibrary.ts.
 */

export interface CacheConfig {
  /** Database name */
  dbName: string;
  /** Store name within the database */
  storeName: string;
  /** Database version */
  version?: number;
  /** Time to live in milliseconds */
  ttlMs: number;
}

export interface CachedItem<T> {
  key: string;
  data: T;
  cachedAt: number;
  expiresAt: number;
}

/**
 * Generic IndexedDB cache class
 *
 * @example
 * ```ts
 * const avatarCache = new IndexedDBCache<AvatarLibraryItem[]>({
 *   dbName: 'yoluno-cache',
 *   storeName: 'avatars',
 *   ttlMs: 7 * 24 * 60 * 60 * 1000, // 7 days
 * });
 *
 * // Store data
 * await avatarCache.set('all-avatars', avatars);
 *
 * // Retrieve data
 * const cached = await avatarCache.get('all-avatars');
 * ```
 */
export class IndexedDBCache<T> {
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig) {
    this.config = {
      ...config,
      version: config.version ?? 1,
    };
  }

  /**
   * Open/get the database connection
   */
  private async getDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version);

      request.onerror = () => {
        this.dbPromise = null;
        reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.config.storeName)) {
          const store = db.createObjectStore(this.config.storeName, { keyPath: 'key' });
          store.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Get an item from the cache
   */
  async get(key: string): Promise<T | null> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.config.storeName, 'readonly');
        const store = transaction.objectStore(this.config.storeName);
        const request = store.get(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = request.result as CachedItem<T> | undefined;

          if (!result) {
            resolve(null);
            return;
          }

          // Check if expired
          if (Date.now() > result.expiresAt) {
            // Clean up expired item asynchronously
            this.delete(key).catch(console.error);
            resolve(null);
            return;
          }

          resolve(result.data);
        };
      });
    } catch (error) {
      console.error('[IndexedDBCache] Get error:', error);
      return null;
    }
  }

  /**
   * Store an item in the cache
   */
  async set(key: string, data: T): Promise<void> {
    try {
      const db = await this.getDB();
      const now = Date.now();

      const item: CachedItem<T> = {
        key,
        data,
        cachedAt: now,
        expiresAt: now + this.config.ttlMs,
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.config.storeName, 'readwrite');
        const store = transaction.objectStore(this.config.storeName);
        const request = store.put(item);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('[IndexedDBCache] Set error:', error);
    }
  }

  /**
   * Delete an item from the cache
   */
  async delete(key: string): Promise<void> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.config.storeName, 'readwrite');
        const store = transaction.objectStore(this.config.storeName);
        const request = store.delete(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('[IndexedDBCache] Delete error:', error);
    }
  }

  /**
   * Check if an item exists and is not expired
   */
  async has(key: string): Promise<boolean> {
    const item = await this.get(key);
    return item !== null;
  }

  /**
   * Get all non-expired items
   */
  async getAll(): Promise<T[]> {
    try {
      const db = await this.getDB();
      const now = Date.now();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.config.storeName, 'readonly');
        const store = transaction.objectStore(this.config.storeName);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const results = (request.result as CachedItem<T>[])
            .filter((item) => item.expiresAt > now)
            .map((item) => item.data);
          resolve(results);
        };
      });
    } catch (error) {
      console.error('[IndexedDBCache] GetAll error:', error);
      return [];
    }
  }

  /**
   * Clear all items from the cache
   */
  async clear(): Promise<void> {
    try {
      const db = await this.getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.config.storeName, 'readwrite');
        const store = transaction.objectStore(this.config.storeName);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('[IndexedDBCache] Clear error:', error);
    }
  }

  /**
   * Remove all expired items
   */
  async cleanExpired(): Promise<number> {
    try {
      const db = await this.getDB();
      const now = Date.now();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.config.storeName, 'readwrite');
        const store = transaction.objectStore(this.config.storeName);
        const index = store.index('expiresAt');
        const range = IDBKeyRange.upperBound(now);
        const request = index.openCursor(range);

        let deletedCount = 0;

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            cursor.delete();
            deletedCount++;
            cursor.continue();
          } else {
            resolve(deletedCount);
          }
        };
      });
    } catch (error) {
      console.error('[IndexedDBCache] CleanExpired error:', error);
      return 0;
    }
  }

  /**
   * Get cache stats
   */
  async getStats(): Promise<{
    itemCount: number;
    expiredCount: number;
    oldestItem: number | null;
    newestItem: number | null;
  }> {
    try {
      const db = await this.getDB();
      const now = Date.now();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.config.storeName, 'readonly');
        const store = transaction.objectStore(this.config.storeName);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const items = request.result as CachedItem<T>[];
          const validItems = items.filter((item) => item.expiresAt > now);
          const expiredItems = items.filter((item) => item.expiresAt <= now);

          const timestamps = validItems.map((item) => item.cachedAt);

          resolve({
            itemCount: validItems.length,
            expiredCount: expiredItems.length,
            oldestItem: timestamps.length > 0 ? Math.min(...timestamps) : null,
            newestItem: timestamps.length > 0 ? Math.max(...timestamps) : null,
          });
        };
      });
    } catch (error) {
      console.error('[IndexedDBCache] GetStats error:', error);
      return {
        itemCount: 0,
        expiredCount: 0,
        oldestItem: null,
        newestItem: null,
      };
    }
  }

  /**
   * Close the database connection
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.dbPromise = null;
    }
  }
}

// ============================================================================
// Pre-configured cache instances
// ============================================================================

/** Cache for avatar library data */
export const avatarLibraryCache = new IndexedDBCache<unknown[]>({
  dbName: 'yoluno-cache',
  storeName: 'avatar-library',
  ttlMs: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/** Cache for avatar images (blob URLs or base64) */
export const avatarImageCache = new IndexedDBCache<string>({
  dbName: 'yoluno-cache',
  storeName: 'avatar-images',
  ttlMs: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/** Cache for story themes */
export const storyThemesCache = new IndexedDBCache<unknown[]>({
  dbName: 'yoluno-cache',
  storeName: 'story-themes',
  ttlMs: 24 * 60 * 60 * 1000, // 24 hours
});

/** Cache for journey templates */
export const journeyTemplatesCache = new IndexedDBCache<unknown[]>({
  dbName: 'yoluno-cache',
  storeName: 'journey-templates',
  ttlMs: 24 * 60 * 60 * 1000, // 24 hours
});
