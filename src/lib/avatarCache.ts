// IndexedDB cache for avatar library
// Provides persistent local storage for avatar data

const DB_NAME = 'yoluno_avatar_cache';
const STORE_NAME = 'avatars';
const DB_VERSION = 1;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedAvatar {
  id: string;
  character_name: string;
  character_slug: string;
  category: 'animal' | 'fantasy' | 'everyday';
  description: string;
  avatar_neutral: string;
  avatar_happy: string;
  avatar_thinking: string;
  avatar_excited: string;
  primary_color: string;
  secondary_color: string;
  cached_at: number;
}

class AvatarCacheDB {
  private db: IDBDatabase | null = null;

  private async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('character_slug', 'character_slug', { unique: true });
          store.createIndex('category', 'category', { unique: false });
        }
      };
    });
  }

  async getAll(): Promise<CachedAvatar[] | null> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const avatars = request.result as CachedAvatar[];
          const now = Date.now();
          
          // Filter out expired entries
          const validAvatars = avatars.filter(
            avatar => now - avatar.cached_at < CACHE_DURATION
          );

          if (validAvatars.length === 0) {
            resolve(null);
          } else {
            resolve(validAvatars);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error reading from avatar cache:', error);
      return null;
    }
  }

  async getByCategory(category: string): Promise<CachedAvatar[] | null> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('category');
        const request = index.getAll(category);

        request.onsuccess = () => {
          const avatars = request.result as CachedAvatar[];
          const now = Date.now();
          
          const validAvatars = avatars.filter(
            avatar => now - avatar.cached_at < CACHE_DURATION
          );

          if (validAvatars.length === 0) {
            resolve(null);
          } else {
            resolve(validAvatars);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error reading from avatar cache by category:', error);
      return null;
    }
  }

  async setAll(avatars: any[]): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const now = Date.now();
        avatars.forEach(avatar => {
          store.put({ ...avatar, cached_at: now });
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error('Error writing to avatar cache:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error clearing avatar cache:', error);
    }
  }
}

export const avatarCache = new AvatarCacheDB();
