export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      avatar_accessories: {
        Row: {
          accessory_id: string
          accessory_type: string
          child_id: string | null
          id: string
          is_equipped: boolean | null
          unlocked_at: string | null
        }
        Insert: {
          accessory_id: string
          accessory_type: string
          child_id?: string | null
          id?: string
          is_equipped?: boolean | null
          unlocked_at?: string | null
        }
        Update: {
          accessory_id?: string
          accessory_type?: string
          child_id?: string | null
          id?: string
          is_equipped?: boolean | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avatar_accessories_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          child_id: string
          content: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          child_id: string
          content: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          child_id?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      child_badges: {
        Row: {
          badge_name: string
          badge_type: string
          child_id: string
          earned_at: string
          id: string
        }
        Insert: {
          badge_name: string
          badge_type: string
          child_id: string
          earned_at?: string
          id?: string
        }
        Update: {
          badge_name?: string
          badge_type?: string
          child_id?: string
          earned_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_badges_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      child_memory: {
        Row: {
          child_id: string
          created_at: string
          id: string
          importance_score: number
          last_accessed_at: string
          memory_key: string
          memory_type: string
          memory_value: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          importance_score?: number
          last_accessed_at?: string
          memory_key: string
          memory_type: string
          memory_value: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          importance_score?: number
          last_accessed_at?: string
          memory_key?: string
          memory_type?: string
          memory_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_memory_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      child_profiles: {
        Row: {
          age: number
          avatar: string | null
          avatar_expression: string | null
          created_at: string
          custom_avatar_url: string | null
          id: string
          last_chat_date: string | null
          name: string
          parent_id: string
          personality_mode: string
          streak_days: number
          updated_at: string
        }
        Insert: {
          age: number
          avatar?: string | null
          avatar_expression?: string | null
          created_at?: string
          custom_avatar_url?: string | null
          id?: string
          last_chat_date?: string | null
          name: string
          parent_id: string
          personality_mode?: string
          streak_days?: number
          updated_at?: string
        }
        Update: {
          age?: number
          avatar?: string | null
          avatar_expression?: string | null
          created_at?: string
          custom_avatar_url?: string | null
          id?: string
          last_chat_date?: string | null
          name?: string
          parent_id?: string
          personality_mode?: string
          streak_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      child_stories: {
        Row: {
          audio_content: string | null
          audio_url: string | null
          bedtime_ready: boolean | null
          characters: Json | null
          child_id: string
          content: string
          created_at: string
          duration_seconds: number | null
          id: string
          illustration_style: string | null
          illustrations: Json | null
          is_favorite: boolean
          mood: string | null
          narration_voice: string | null
          parent_intro_url: string | null
          prompt: string
          scenes: Json | null
          story_length: string | null
          theme: string | null
          title: string
          values: string[] | null
        }
        Insert: {
          audio_content?: string | null
          audio_url?: string | null
          bedtime_ready?: boolean | null
          characters?: Json | null
          child_id: string
          content: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          illustration_style?: string | null
          illustrations?: Json | null
          is_favorite?: boolean
          mood?: string | null
          narration_voice?: string | null
          parent_intro_url?: string | null
          prompt: string
          scenes?: Json | null
          story_length?: string | null
          theme?: string | null
          title: string
          values?: string[] | null
        }
        Update: {
          audio_content?: string | null
          audio_url?: string | null
          bedtime_ready?: boolean | null
          characters?: Json | null
          child_id?: string
          content?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          illustration_style?: string | null
          illustrations?: Json | null
          is_favorite?: boolean
          mood?: string | null
          narration_voice?: string | null
          parent_intro_url?: string | null
          prompt?: string
          scenes?: Json | null
          story_length?: string | null
          theme?: string | null
          title?: string
          values?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "child_stories_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      child_topics: {
        Row: {
          child_id: string
          created_at: string
          id: string
          topic: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          topic: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_topics_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_moderation_logs: {
        Row: {
          child_id: string
          created_at: string
          flag_reason: string
          id: string
          message_content: string
          severity: string
        }
        Insert: {
          child_id: string
          created_at?: string
          flag_reason: string
          id?: string
          message_content: string
          severity: string
        }
        Update: {
          child_id?: string
          created_at?: string
          flag_reason?: string
          id?: string
          message_content?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_moderation_logs_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_stats: {
        Row: {
          child_id: string
          id: string
          last_message_at: string
          message_count: number
          topic: string
        }
        Insert: {
          child_id: string
          id?: string
          last_message_at?: string
          message_count?: number
          topic: string
        }
        Update: {
          child_id?: string
          id?: string
          last_message_at?: string
          message_count?: number
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_stats_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_summaries: {
        Row: {
          child_id: string
          created_at: string
          id: string
          message_count: number
          session_date: string
          summary: string
          topics_discussed: string[]
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          message_count?: number
          session_date: string
          summary: string
          topics_discussed?: string[]
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          message_count?: number
          session_date?: string
          summary?: string
          topics_discussed?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "conversation_summaries_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_content: {
        Row: {
          age_range: string
          answer: string
          child_id: string | null
          created_at: string
          id: string
          keywords: string[]
          parent_id: string
          question: string
          topic: string
          updated_at: string
        }
        Insert: {
          age_range: string
          answer: string
          child_id?: string | null
          created_at?: string
          id?: string
          keywords?: string[]
          parent_id: string
          question: string
          topic: string
          updated_at?: string
        }
        Update: {
          age_range?: string
          answer?: string
          child_id?: string | null
          created_at?: string
          id?: string
          keywords?: string[]
          parent_id?: string
          question?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_content_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_topic_packs: {
        Row: {
          created_at: string | null
          description: string | null
          emoji: string | null
          id: string
          is_public: boolean | null
          name: string
          parent_id: string
          topics: string[]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          parent_id: string
          topics: string[]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          parent_id?: string
          topics?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      goal_journeys: {
        Row: {
          allow_sharing: boolean | null
          child_id: string
          completed_at: string | null
          created_at: string
          current_step: number
          description: string | null
          duration_days: number
          goal_type: string
          id: string
          journey_category: string
          mission_schedule_time: string | null
          parent_id: string
          reward_details: Json | null
          reward_type: string
          status: string
          title: string
          total_steps: number
          updated_at: string
        }
        Insert: {
          allow_sharing?: boolean | null
          child_id: string
          completed_at?: string | null
          created_at?: string
          current_step?: number
          description?: string | null
          duration_days: number
          goal_type: string
          id?: string
          journey_category: string
          mission_schedule_time?: string | null
          parent_id: string
          reward_details?: Json | null
          reward_type: string
          status?: string
          title: string
          total_steps: number
          updated_at?: string
        }
        Update: {
          allow_sharing?: boolean | null
          child_id?: string
          completed_at?: string | null
          created_at?: string
          current_step?: number
          description?: string | null
          duration_days?: number
          goal_type?: string
          id?: string
          journey_category?: string
          mission_schedule_time?: string | null
          parent_id?: string
          reward_details?: Json | null
          reward_type?: string
          status?: string
          title?: string
          total_steps?: number
          updated_at?: string
        }
        Relationships: []
      }
      journey_progress_log: {
        Row: {
          buddy_message: string | null
          child_id: string
          child_reflection: string | null
          completed: boolean
          id: string
          journey_id: string
          logged_at: string
          parent_reflection_prompt: string | null
          step_id: string
        }
        Insert: {
          buddy_message?: string | null
          child_id: string
          child_reflection?: string | null
          completed: boolean
          id?: string
          journey_id: string
          logged_at?: string
          parent_reflection_prompt?: string | null
          step_id: string
        }
        Update: {
          buddy_message?: string | null
          child_id?: string
          child_reflection?: string | null
          completed?: boolean
          id?: string
          journey_id?: string
          logged_at?: string
          parent_reflection_prompt?: string | null
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_progress_log_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "goal_journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_progress_log_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "journey_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_shares: {
        Row: {
          download_count: number
          id: string
          journey_id: string
          privacy_level: string
          rating: number | null
          shared_at: string
          shared_by_parent_id: string
        }
        Insert: {
          download_count?: number
          id?: string
          journey_id: string
          privacy_level?: string
          rating?: number | null
          shared_at?: string
          shared_by_parent_id: string
        }
        Update: {
          download_count?: number
          id?: string
          journey_id?: string
          privacy_level?: string
          rating?: number | null
          shared_at?: string
          shared_by_parent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_shares_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "goal_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_steps: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          is_completed: boolean
          journey_id: string
          reflection: string | null
          step_number: number
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          journey_id: string
          reflection?: string | null
          step_number: number
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          journey_id?: string
          reflection?: string | null
          step_number?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_steps_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "goal_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_templates: {
        Row: {
          age_range: string
          category: string
          community_shares_count: number
          created_at: string
          creator_id: string | null
          description: string
          download_count: number
          duration_days: number
          emoji: string
          id: string
          is_positive_habit: boolean
          is_public: boolean
          name: string
          rating: number | null
          steps_template: Json
          updated_at: string
        }
        Insert: {
          age_range: string
          category: string
          community_shares_count?: number
          created_at?: string
          creator_id?: string | null
          description: string
          download_count?: number
          duration_days: number
          emoji: string
          id?: string
          is_positive_habit?: boolean
          is_public?: boolean
          name: string
          rating?: number | null
          steps_template?: Json
          updated_at?: string
        }
        Update: {
          age_range?: string
          category?: string
          community_shares_count?: number
          created_at?: string
          creator_id?: string | null
          description?: string
          download_count?: number
          duration_days?: number
          emoji?: string
          id?: string
          is_positive_habit?: boolean
          is_public?: boolean
          name?: string
          rating?: number | null
          steps_template?: Json
          updated_at?: string
        }
        Relationships: []
      }
      parent_approved_content: {
        Row: {
          approved_at: string
          child_id: string | null
          content_id: string
          id: string
          notes: string | null
          parent_id: string
        }
        Insert: {
          approved_at?: string
          child_id?: string | null
          content_id: string
          id?: string
          notes?: string | null
          parent_id: string
        }
        Update: {
          approved_at?: string
          child_id?: string | null
          content_id?: string
          id?: string
          notes?: string | null
          parent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_approved_content_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_approved_content_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "topic_content"
            referencedColumns: ["id"]
          },
        ]
      }
      story_themes: {
        Row: {
          age_appropriate: string[] | null
          created_at: string | null
          description: string
          emoji: string
          id: string
          name: string
        }
        Insert: {
          age_appropriate?: string[] | null
          created_at?: string | null
          description: string
          emoji: string
          id?: string
          name: string
        }
        Update: {
          age_appropriate?: string[] | null
          created_at?: string | null
          description?: string
          emoji?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      story_usage: {
        Row: {
          created_at: string | null
          id: string
          month: string
          parent_id: string
          story_count: number | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          month: string
          parent_id: string
          story_count?: number | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          month?: string
          parent_id?: string
          story_count?: number | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      topic_analytics: {
        Row: {
          child_id: string
          created_at: string | null
          engagement_score: number | null
          id: string
          last_used_at: string | null
          message_count: number | null
          topic: string
        }
        Insert: {
          child_id: string
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          last_used_at?: string | null
          message_count?: number | null
          topic: string
        }
        Update: {
          child_id?: string
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          last_used_at?: string | null
          message_count?: number | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_analytics_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_content: {
        Row: {
          age_range: string
          answer: string
          created_at: string
          difficulty_level: string
          id: string
          is_reviewed: boolean | null
          keywords: string[]
          question: string
          topic: string
          updated_at: string
        }
        Insert: {
          age_range: string
          answer: string
          created_at?: string
          difficulty_level: string
          id?: string
          is_reviewed?: boolean | null
          keywords?: string[]
          question: string
          topic: string
          updated_at?: string
        }
        Update: {
          age_range?: string
          answer?: string
          created_at?: string
          difficulty_level?: string
          id?: string
          is_reviewed?: boolean | null
          keywords?: string[]
          question?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      topic_feedback: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          parent_id: string
          rating: number | null
          topic: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          parent_id: string
          rating?: number | null
          topic: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          parent_id?: string
          rating?: number | null
          topic?: string
        }
        Relationships: []
      }
      topic_packs: {
        Row: {
          created_at: string
          description: string
          emoji: string
          id: string
          name: string
          topics: string[]
        }
        Insert: {
          created_at?: string
          description: string
          emoji: string
          id?: string
          name: string
          topics: string[]
        }
        Update: {
          created_at?: string
          description?: string
          emoji?: string
          id?: string
          name?: string
          topics?: string[]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_award_badges: {
        Args: { p_child_id: string }
        Returns: undefined
      }
      update_child_streak: {
        Args: { p_child_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
