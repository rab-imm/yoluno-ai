/**
 * Child Context
 *
 * Provides active child profile state for kids mode.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { ChildProfileRow } from '@/types/database';
import { childProfilesService } from '@/services/childProfiles';

interface ChildContextValue {
  activeChild: ChildProfileRow | null;
  isKidsMode: boolean;
  setActiveChild: (child: ChildProfileRow | null) => void;
  enterKidsMode: (child: ChildProfileRow) => void;
  exitKidsMode: () => void;
  verifyPin: (childId: string, pin: string) => Promise<boolean>;
}

const ChildContext = createContext<ChildContextValue | null>(null);

const STORAGE_KEY = 'yoluno_active_child';

interface ChildProviderProps {
  children: ReactNode;
}

export function ChildProvider({ children }: ChildProviderProps) {
  const [activeChild, setActiveChildState] = useState<ChildProfileRow | null>(null);
  const [isKidsMode, setIsKidsMode] = useState(false);

  // Restore active child from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { childId, isKidsMode: storedKidsMode } = JSON.parse(stored);
        if (childId) {
          childProfilesService.getById(childId).then((child) => {
            if (child) {
              setActiveChildState(child);
              setIsKidsMode(storedKidsMode);
            }
          });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const setActiveChild = useCallback((child: ChildProfileRow | null) => {
    setActiveChildState(child);
    if (child) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ childId: child.id, isKidsMode })
      );
      childProfilesService.updateLastActive(child.id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isKidsMode]);

  const enterKidsMode = useCallback((child: ChildProfileRow) => {
    setActiveChildState(child);
    setIsKidsMode(true);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ childId: child.id, isKidsMode: true })
    );
    childProfilesService.updateLastActive(child.id);
  }, []);

  const exitKidsMode = useCallback(() => {
    setActiveChildState(null);
    setIsKidsMode(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const verifyPin = useCallback(async (childId: string, pin: string): Promise<boolean> => {
    // In a real implementation, this would verify against a hashed PIN in the database
    // For now, return true if PIN is provided (placeholder implementation)
    const child = await childProfilesService.getById(childId);
    if (!child?.pin_hash) {
      return true; // No PIN set
    }
    // TODO: Implement proper PIN verification with hashing
    return pin.length === 4;
  }, []);

  const value: ChildContextValue = {
    activeChild,
    isKidsMode,
    setActiveChild,
    enterKidsMode,
    exitKidsMode,
    verifyPin,
  };

  return <ChildContext.Provider value={value}>{children}</ChildContext.Provider>;
}

export function useChild(): ChildContextValue {
  const context = useContext(ChildContext);

  if (!context) {
    throw new Error('useChild must be used within a ChildProvider');
  }

  return context;
}

export function useActiveChild(): ChildProfileRow | null {
  const { activeChild } = useChild();
  return activeChild;
}

export function useIsKidsMode(): boolean {
  const { isKidsMode } = useChild();
  return isKidsMode;
}
