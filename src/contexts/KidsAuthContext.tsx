import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface KidsSession {
  sessionToken: string;
  childId: string;
  childName: string;
  expiresAt: Date;
}

interface KidsAuthContextType {
  session: KidsSession | null;
  isLoading: boolean;
  login: (childId: string, pin: string) => Promise<boolean>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const KidsAuthContext = createContext<KidsAuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = "kids_session";
const SESSION_DURATION_HOURS = 24;
const INACTIVITY_TIMEOUT_MINUTES = 30;

export function KidsAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<KidsSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  // Check for existing session on mount
  useEffect(() => {
    const loadSession = async () => {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        try {
          const parsedSession: KidsSession = JSON.parse(storedSession);
          const expiresAt = new Date(parsedSession.expiresAt);
          
          if (expiresAt > new Date()) {
            // Verify session still exists in database
            const { data, error } = await supabase
              .from("kids_sessions")
              .select("*")
              .eq("session_token", parsedSession.sessionToken)
              .single();

            if (data && !error) {
              setSession(parsedSession);
            } else {
              localStorage.removeItem(SESSION_STORAGE_KEY);
            }
          } else {
            localStorage.removeItem(SESSION_STORAGE_KEY);
          }
        } catch (error) {
          console.error("Error loading session:", error);
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    loadSession();
  }, []);

  // Track activity and auto-logout on inactivity
  useEffect(() => {
    if (!session) return;

    const checkInactivity = () => {
      const now = Date.now();
      const inactiveMinutes = (now - lastActivityTime) / 1000 / 60;
      
      if (inactiveMinutes >= INACTIVITY_TIMEOUT_MINUTES) {
        logout();
        toast.info("Session ended due to inactivity");
      }
    };

    const activityHandler = () => setLastActivityTime(Date.now());
    
    // Listen for user activity
    window.addEventListener("mousedown", activityHandler);
    window.addEventListener("keydown", activityHandler);
    window.addEventListener("touchstart", activityHandler);
    
    // Check inactivity every minute
    const interval = setInterval(checkInactivity, 60000);

    return () => {
      window.removeEventListener("mousedown", activityHandler);
      window.removeEventListener("keydown", activityHandler);
      window.removeEventListener("touchstart", activityHandler);
      clearInterval(interval);
    };
  }, [session, lastActivityTime]);

  const login = async (childId: string, pin: string): Promise<boolean> => {
    try {
      // Verify PIN
      const { data: child, error: childError } = await supabase
        .from("child_profiles")
        .select("id, name, pin_code, pin_enabled")
        .eq("id", childId)
        .single();

      if (childError || !child) {
        toast.error("Profile not found");
        return false;
      }

      if (child.pin_enabled && child.pin_code !== pin) {
        toast.error("Incorrect PIN. Try again!");
        return false;
      }

      // Create session
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);

      const deviceInfo = navigator.userAgent;

      const { error: sessionError } = await supabase
        .from("kids_sessions")
        .insert({
          child_id: childId,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          device_info: deviceInfo,
        });

      if (sessionError) {
        console.error("Session creation error:", sessionError);
        toast.error("Could not start session");
        return false;
      }

      // Update last access time
      await supabase
        .from("child_profiles")
        .update({ last_access_at: new Date().toISOString() })
        .eq("id", childId);

      // Store session
      const newSession: KidsSession = {
        sessionToken,
        childId,
        childName: child.name,
        expiresAt,
      };

      setSession(newSession);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
      setLastActivityTime(Date.now());

      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
      return false;
    }
  };

  const logout = async () => {
    if (session) {
      // Delete session from database
      await supabase
        .from("kids_sessions")
        .delete()
        .eq("session_token", session.sessionToken);
    }

    setSession(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const refreshSession = async () => {
    if (!session) return;

    try {
      // Update last activity time in database
      await supabase
        .from("kids_sessions")
        .update({ last_activity_at: new Date().toISOString() })
        .eq("session_token", session.sessionToken);

      setLastActivityTime(Date.now());
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  return (
    <KidsAuthContext.Provider
      value={{ session, isLoading, login, logout, refreshSession }}
    >
      {children}
    </KidsAuthContext.Provider>
  );
}

export function useKidsAuth() {
  const context = useContext(KidsAuthContext);
  if (!context) {
    throw new Error("useKidsAuth must be used within KidsAuthProvider");
  }
  return context;
}
