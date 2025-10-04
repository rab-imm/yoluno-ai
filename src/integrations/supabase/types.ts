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
          child_id: string
          content: string
          created_at: string
          id: string
          is_favorite: boolean
          prompt: string
          title: string
        }
        Insert: {
          child_id: string
          content: string
          created_at?: string
          id?: string
          is_favorite?: boolean
          prompt: string
          title: string
        }
        Update: {
          child_id?: string
          content?: string
          created_at?: string
          id?: string
          is_favorite?: boolean
          prompt?: string
          title?: string
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
