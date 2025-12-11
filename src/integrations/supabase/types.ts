/**
 * Supabase Database Types
 *
 * Auto-generated types for Supabase tables.
 * Regenerate with: npx supabase gen types typescript --project-id <project-id>
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      child_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          age: number;
          avatar_id: string | null;
          personality_mode: string | null;
          interests: string[] | null;
          learning_style: string | null;
          created_at: string;
          updated_at: string;
          last_active_at: string | null;
          pin_hash: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          age: number;
          avatar_id?: string | null;
          personality_mode?: string | null;
          interests?: string[] | null;
          learning_style?: string | null;
          created_at?: string;
          updated_at?: string;
          last_active_at?: string | null;
          pin_hash?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          age?: number;
          avatar_id?: string | null;
          personality_mode?: string | null;
          interests?: string[] | null;
          learning_style?: string | null;
          created_at?: string;
          updated_at?: string;
          last_active_at?: string | null;
          pin_hash?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'child_profiles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'child_profiles_avatar_id_fkey';
            columns: ['avatar_id'];
            isOneToOne: false;
            referencedRelation: 'avatar_library';
            referencedColumns: ['id'];
          },
        ];
      };
      stories: {
        Row: {
          id: string;
          child_profile_id: string;
          title: string;
          content: string | null;
          theme: string | null;
          mood: string | null;
          values: string[] | null;
          word_count: number | null;
          illustration_style: string | null;
          narration_voice: string | null;
          is_favorite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_profile_id: string;
          title: string;
          content?: string | null;
          theme?: string | null;
          mood?: string | null;
          values?: string[] | null;
          word_count?: number | null;
          illustration_style?: string | null;
          narration_voice?: string | null;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          child_profile_id?: string;
          title?: string;
          content?: string | null;
          theme?: string | null;
          mood?: string | null;
          values?: string[] | null;
          word_count?: number | null;
          illustration_style?: string | null;
          narration_voice?: string | null;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'stories_child_profile_id_fkey';
            columns: ['child_profile_id'];
            isOneToOne: false;
            referencedRelation: 'child_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      family_members: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          relationship_type: string | null;
          birth_date: string | null;
          photo_url: string | null;
          notes: string | null;
          is_alive: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          relationship_type?: string | null;
          birth_date?: string | null;
          photo_url?: string | null;
          notes?: string | null;
          is_alive?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          relationship_type?: string | null;
          birth_date?: string | null;
          photo_url?: string | null;
          notes?: string | null;
          is_alive?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'family_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      family_relationships: {
        Row: {
          id: string;
          user_id: string;
          member1_id: string;
          member2_id: string;
          relationship_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          member1_id: string;
          member2_id: string;
          relationship_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          member1_id?: string;
          member2_id?: string;
          relationship_type?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'family_relationships_member1_id_fkey';
            columns: ['member1_id'];
            isOneToOne: false;
            referencedRelation: 'family_members';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'family_relationships_member2_id_fkey';
            columns: ['member2_id'];
            isOneToOne: false;
            referencedRelation: 'family_members';
            referencedColumns: ['id'];
          },
        ];
      };
      journeys: {
        Row: {
          id: string;
          child_profile_id: string;
          template_id: string | null;
          title: string;
          description: string | null;
          status: string;
          progress: number;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          child_profile_id: string;
          template_id?: string | null;
          title: string;
          description?: string | null;
          status?: string;
          progress?: number;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          child_profile_id?: string;
          template_id?: string | null;
          title?: string;
          description?: string | null;
          status?: string;
          progress?: number;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'journeys_child_profile_id_fkey';
            columns: ['child_profile_id'];
            isOneToOne: false;
            referencedRelation: 'child_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      journey_steps: {
        Row: {
          id: string;
          journey_id: string;
          title: string;
          description: string | null;
          type: string;
          status: string;
          order_index: number;
          progress: number | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          journey_id: string;
          title: string;
          description?: string | null;
          type: string;
          status?: string;
          order_index: number;
          progress?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          journey_id?: string;
          title?: string;
          description?: string | null;
          type?: string;
          status?: string;
          order_index?: number;
          progress?: number | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'journey_steps_journey_id_fkey';
            columns: ['journey_id'];
            isOneToOne: false;
            referencedRelation: 'journeys';
            referencedColumns: ['id'];
          },
        ];
      };
      guardrail_settings: {
        Row: {
          id: string;
          child_profile_id: string;
          safety_level: string;
          allowed_topics: string[] | null;
          blocked_topics: string[] | null;
          max_session_minutes: number | null;
          require_breaks: boolean;
          break_interval_minutes: number | null;
          content_filters_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_profile_id: string;
          safety_level?: string;
          allowed_topics?: string[] | null;
          blocked_topics?: string[] | null;
          max_session_minutes?: number | null;
          require_breaks?: boolean;
          break_interval_minutes?: number | null;
          content_filters_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          child_profile_id?: string;
          safety_level?: string;
          allowed_topics?: string[] | null;
          blocked_topics?: string[] | null;
          max_session_minutes?: number | null;
          require_breaks?: boolean;
          break_interval_minutes?: number | null;
          content_filters_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'guardrail_settings_child_profile_id_fkey';
            columns: ['child_profile_id'];
            isOneToOne: true;
            referencedRelation: 'child_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      avatar_library: {
        Row: {
          id: string;
          name: string;
          category: string;
          image_url: string;
          thumbnail_url: string | null;
          is_animated: boolean | null;
          is_premium: boolean | null;
          is_active: boolean;
          tags: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          image_url: string;
          thumbnail_url?: string | null;
          is_animated?: boolean | null;
          is_premium?: boolean | null;
          is_active?: boolean;
          tags?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          image_url?: string;
          thumbnail_url?: string | null;
          is_animated?: boolean | null;
          is_premium?: boolean | null;
          is_active?: boolean;
          tags?: string[] | null;
          created_at?: string;
        };
        Relationships: [];
      };
      chat_sessions: {
        Row: {
          id: string;
          child_profile_id: string;
          started_at: string;
          ended_at: string | null;
          message_count: number;
          summary: string | null;
        };
        Insert: {
          id?: string;
          child_profile_id: string;
          started_at?: string;
          ended_at?: string | null;
          message_count?: number;
          summary?: string | null;
        };
        Update: {
          id?: string;
          child_profile_id?: string;
          started_at?: string;
          ended_at?: string | null;
          message_count?: number;
          summary?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_sessions_child_profile_id_fkey';
            columns: ['child_profile_id'];
            isOneToOne: false;
            referencedRelation: 'child_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          role: string;
          content: string;
          safety_level: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: string;
          content: string;
          safety_level?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: string;
          content?: string;
          safety_level?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_messages_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'chat_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: string;
          status: string;
          stories_used: number;
          stories_limit: number;
          chat_messages_used: number;
          chat_messages_limit: number;
          period_start: string;
          period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier?: string;
          status?: string;
          stories_used?: number;
          stories_limit?: number;
          chat_messages_used?: number;
          chat_messages_limit?: number;
          period_start?: string;
          period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tier?: string;
          status?: string;
          stories_used?: number;
          stories_limit?: number;
          chat_messages_used?: number;
          chat_messages_limit?: number;
          period_start?: string;
          period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// Helper types
type PublicSchema = Database['public'];

export type Tables<
  TableName extends keyof PublicSchema['Tables'],
> = PublicSchema['Tables'][TableName]['Row'];

export type TablesInsert<
  TableName extends keyof PublicSchema['Tables'],
> = PublicSchema['Tables'][TableName]['Insert'];

export type TablesUpdate<
  TableName extends keyof PublicSchema['Tables'],
> = PublicSchema['Tables'][TableName]['Update'];
