import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GuardrailSettings {
  id?: string;
  parent_id?: string;
  strictness_level: string;
  block_on_yellow: boolean;
  notify_on_yellow: boolean;
  notify_on_green: boolean;
  require_explicit_approval: boolean;
  auto_expand_topics: boolean;
  messages_per_minute: number;
  messages_per_hour: number;
  max_response_length: number;
  learn_from_approvals: boolean;
  preferred_ai_tone: string;
  custom_blocked_keywords: string[];
  custom_allowed_phrases: string[];
}

const DEFAULT_SETTINGS: GuardrailSettings = {
  strictness_level: "medium",
  block_on_yellow: false,
  notify_on_yellow: true,
  notify_on_green: false,
  require_explicit_approval: false,
  auto_expand_topics: true,
  messages_per_minute: 5,
  messages_per_hour: 50,
  max_response_length: 300,
  learn_from_approvals: true,
  preferred_ai_tone: "friendly",
  custom_blocked_keywords: [],
  custom_allowed_phrases: [],
};

export function useGuardrailSettings() {
  const [settings, setSettings] = useState<GuardrailSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("guardrail_settings")
        .select("*")
        .eq("parent_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          id: data.id,
          parent_id: data.parent_id,
          strictness_level: data.strictness_level || DEFAULT_SETTINGS.strictness_level,
          block_on_yellow: data.block_on_yellow ?? DEFAULT_SETTINGS.block_on_yellow,
          notify_on_yellow: data.notify_on_yellow ?? DEFAULT_SETTINGS.notify_on_yellow,
          notify_on_green: data.notify_on_green ?? DEFAULT_SETTINGS.notify_on_green,
          require_explicit_approval: data.require_explicit_approval ?? DEFAULT_SETTINGS.require_explicit_approval,
          auto_expand_topics: data.auto_expand_topics ?? DEFAULT_SETTINGS.auto_expand_topics,
          messages_per_minute: data.messages_per_minute ?? DEFAULT_SETTINGS.messages_per_minute,
          messages_per_hour: data.messages_per_hour ?? DEFAULT_SETTINGS.messages_per_hour,
          max_response_length: data.max_response_length ?? DEFAULT_SETTINGS.max_response_length,
          learn_from_approvals: data.learn_from_approvals ?? DEFAULT_SETTINGS.learn_from_approvals,
          preferred_ai_tone: data.preferred_ai_tone || DEFAULT_SETTINGS.preferred_ai_tone,
          custom_blocked_keywords: data.custom_blocked_keywords || [],
          custom_allowed_phrases: data.custom_allowed_phrases || [],
        });
      }
    } catch (error) {
      console.error("Error fetching guardrail settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<GuardrailSettings>) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from("guardrail_settings")
        .upsert({
          parent_id: user.id,
          strictness_level: updatedSettings.strictness_level,
          block_on_yellow: updatedSettings.block_on_yellow,
          notify_on_yellow: updatedSettings.notify_on_yellow,
          notify_on_green: updatedSettings.notify_on_green,
          require_explicit_approval: updatedSettings.require_explicit_approval,
          auto_expand_topics: updatedSettings.auto_expand_topics,
          messages_per_minute: updatedSettings.messages_per_minute,
          messages_per_hour: updatedSettings.messages_per_hour,
          max_response_length: updatedSettings.max_response_length,
          learn_from_approvals: updatedSettings.learn_from_approvals,
          preferred_ai_tone: updatedSettings.preferred_ai_tone,
          custom_blocked_keywords: updatedSettings.custom_blocked_keywords,
          custom_allowed_phrases: updatedSettings.custom_allowed_phrases,
          updated_at: new Date().toISOString(),
        }, { onConflict: "parent_id" });

      if (error) throw error;

      setSettings(updatedSettings);
      toast({ title: "Settings saved", description: "Your guardrail settings have been updated." });
    } catch (error) {
      console.error("Error saving guardrail settings:", error);
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = async () => {
    await saveSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    isLoading,
    isSaving,
    saveSettings,
    resetToDefaults,
    DEFAULT_SETTINGS,
  };
}
