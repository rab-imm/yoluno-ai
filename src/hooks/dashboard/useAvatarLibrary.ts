import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AvatarLibraryItem {
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
}

// IndexedDB cache utilities for Phase 3 frontend caching
const DB_NAME = 'paliyo-cache';
const STORE_NAME = 'avatars';
const DB_VERSION = 1;

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function getAvatarCache(category?: string): Promise<AvatarLibraryItem[] | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const key = category || 'all';
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const cached = request.result;
        // Check if cache is still valid (24 hours)
        if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
          resolve(cached.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB cache read error:', error);
    return null;
  }
}

async function setAvatarCache(category: string | undefined, data: AvatarLibraryItem[]): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const key = category || 'all';
    
    await new Promise((resolve, reject) => {
      const request = store.put({ data, timestamp: Date.now() }, key);
      request.onsuccess = () => resolve(undefined);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB cache write error:', error);
  }
}

export function useAvatarLibrary(category?: string) {
  return useQuery({
    queryKey: ["avatar-library", category],
    queryFn: async () => {
      // Phase 3: Try to load from IndexedDB cache first
      const cachedData = await getAvatarCache(category);
      if (cachedData) {
        console.log("✓ Loading avatars from IndexedDB cache (instant)");
        return cachedData;
      }

      console.log("⟳ Fetching avatars from database...");
      
      // If not in cache, fetch from database (with CDN-cached images)
      let query = supabase
        .from("avatar_library")
        .select("*")
        .order("character_name");

      if (category && category !== 'all') {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const typedData = data as AvatarLibraryItem[];
      
      // Cache the data in IndexedDB for next time
      if (typedData) {
        await setAvatarCache(category, typedData);
        console.log("✓ Cached avatars in IndexedDB");
      }
      
      return typedData;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - avatars rarely change
    gcTime: 7 * 24 * 60 * 60 * 1000, // Keep in memory for 7 days (formerly cacheTime)
    refetchOnMount: false, // Don't refetch on component mount
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}