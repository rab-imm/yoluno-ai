import { useMemo } from "react";
import { useChildProfiles } from "./useChildProfiles";

interface GreetingData {
  greeting: string;
  message: string;
  emoji: string;
}

export function useDashboardGreeting(): GreetingData {
  const { children } = useChildProfiles();

  return useMemo(() => {
    const hour = new Date().getHours();
    let timeGreeting = "Good evening";
    let emoji = "🌙";

    if (hour < 12) {
      timeGreeting = "Good morning";
      emoji = "☀️";
    } else if (hour < 18) {
      timeGreeting = "Good afternoon";
      emoji = "✨";
    }

    let message = "Ready to create some magic?";
    
    if (children.length === 0) {
      message = "Let's set up your first child profile and start creating magical moments!";
    } else if (children.length === 1) {
      message = `Let's continue ${children[0].name}'s journey today!`;
    } else {
      message = `Your ${children.length} adventurers are ready to explore!`;
    }

    return {
      greeting: timeGreeting,
      message,
      emoji,
    };
  }, [children]);
}
