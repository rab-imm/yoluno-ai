import { createContext, useContext } from "react";
import { ChildProfile } from "./useChildProfiles";

interface ChildContextType {
  selectedChild: ChildProfile | null;
  setSelectedChildId: (id: string) => void;
}

export const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function useChildContext() {
  const context = useContext(ChildContext);
  if (!context) {
    throw new Error("useChildContext must be used within ChildContextProvider");
  }
  return context;
}
