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
          image_url: string | null
          is_equipped: boolean | null
          position_x: number | null
          position_y: number | null
          unlocked_at: string | null
        }
        Insert: {
          accessory_id: string
          accessory_type: string
          child_id?: string | null
          id?: string
          image_url?: string | null
          is_equipped?: boolean | null
          position_x?: number | null
          position_y?: number | null
          unlocked_at?: string | null
        }
        Update: {
          accessory_id?: string
          accessory_type?: string
          child_id?: string | null
          id?: string
          image_url?: string | null
          is_equipped?: boolean | null
          position_x?: number | null
          position_y?: number | null
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
      avatar_library: {
        Row: {
          avatar_excited: string
          avatar_happy: string
          avatar_neutral: string
          avatar_thinking: string
          category: string
          character_name: string
          character_slug: string
          created_at: string | null
          description: string | null
          id: string
          primary_color: string | null
          secondary_color: string | null
        }
        Insert: {
          avatar_excited: string
          avatar_happy: string
          avatar_neutral: string
          avatar_thinking: string
          category: string
          character_name: string
          character_slug: string
          created_at?: string | null
          description?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
        }
        Update: {
          avatar_excited?: string
          avatar_happy?: string
          avatar_neutral?: string
          avatar_thinking?: string
          category?: string
          character_name?: string
          character_slug?: string
          created_at?: string | null
          description?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
        }
        Relationships: []
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
      child_feedback: {
        Row: {
          child_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          parent_id: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          parent_id: string
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          parent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_feedback_child_id_fkey"
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
          avatar_library_id: string | null
          created_at: string
          custom_avatar_url: string | null
          id: string
          last_access_at: string | null
          last_chat_date: string | null
          name: string
          parent_id: string
          personality_mode: string
          pin_code: string | null
          pin_enabled: boolean | null
          streak_days: number
          updated_at: string
          use_library_avatar: boolean | null
        }
        Insert: {
          age: number
          avatar?: string | null
          avatar_expression?: string | null
          avatar_library_id?: string | null
          created_at?: string
          custom_avatar_url?: string | null
          id?: string
          last_access_at?: string | null
          last_chat_date?: string | null
          name: string
          parent_id: string
          personality_mode?: string
          pin_code?: string | null
          pin_enabled?: boolean | null
          streak_days?: number
          updated_at?: string
          use_library_avatar?: boolean | null
        }
        Update: {
          age?: number
          avatar?: string | null
          avatar_expression?: string | null
          avatar_library_id?: string | null
          created_at?: string
          custom_avatar_url?: string | null
          id?: string
          last_access_at?: string | null
          last_chat_date?: string | null
          name?: string
          parent_id?: string
          personality_mode?: string
          pin_code?: string | null
          pin_enabled?: boolean | null
          streak_days?: number
          updated_at?: string
          use_library_avatar?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "child_profiles_avatar_library_id_fkey"
            columns: ["avatar_library_id"]
            isOneToOne: false
            referencedRelation: "avatar_library"
            referencedColumns: ["id"]
          },
        ]
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
      family_history_access: {
        Row: {
          age_restriction:
            | Database["public"]["Enums"]["age_restriction_level"]
            | null
          child_id: string
          created_at: string
          id: string
          is_enabled: boolean | null
          parent_id: string
          updated_at: string
        }
        Insert: {
          age_restriction?:
            | Database["public"]["Enums"]["age_restriction_level"]
            | null
          child_id: string
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          parent_id: string
          updated_at?: string
        }
        Update: {
          age_restriction?:
            | Database["public"]["Enums"]["age_restriction_level"]
            | null
          child_id?: string
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          parent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_history_access_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          bio: string | null
          birth_date: string | null
          child_id: string | null
          created_at: string
          id: string
          location: string | null
          name: string
          parent_id: string
          photo_url: string | null
          relationship: string | null
          tree_position_x: number | null
          tree_position_y: number | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          birth_date?: string | null
          child_id?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name: string
          parent_id: string
          photo_url?: string | null
          relationship?: string | null
          tree_position_x?: number | null
          tree_position_y?: number | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          birth_date?: string | null
          child_id?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          parent_id?: string
          photo_url?: string | null
          relationship?: string | null
          tree_position_x?: number | null
          tree_position_y?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      family_narratives: {
        Row: {
          content: string
          created_at: string
          id: string
          media_urls: string[] | null
          member_id: string
          parent_id: string
          story_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          member_id: string
          parent_id: string
          story_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          member_id?: string
          parent_id?: string
          story_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_narratives_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      family_photos: {
        Row: {
          ai_caption: string | null
          created_at: string
          date_taken: string | null
          description: string | null
          file_size_bytes: number
          id: string
          image_url: string
          linked_member_ids: string[] | null
          location: string | null
          parent_id: string
          updated_at: string
        }
        Insert: {
          ai_caption?: string | null
          created_at?: string
          date_taken?: string | null
          description?: string | null
          file_size_bytes: number
          id?: string
          image_url: string
          linked_member_ids?: string[] | null
          location?: string | null
          parent_id: string
          updated_at?: string
        }
        Update: {
          ai_caption?: string | null
          created_at?: string
          date_taken?: string | null
          description?: string | null
          file_size_bytes?: number
          id?: string
          image_url?: string
          linked_member_ids?: string[] | null
          location?: string | null
          parent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      family_relationships: {
        Row: {
          created_at: string
          id: string
          parent_id: string
          person_id: string
          related_person_id: string
          relationship_type: string
          tree_position_x: number | null
          tree_position_y: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          parent_id: string
          person_id: string
          related_person_id: string
          relationship_type: string
          tree_position_x?: number | null
          tree_position_y?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          parent_id?: string
          person_id?: string
          related_person_id?: string
          relationship_type?: string
          tree_position_x?: number | null
          tree_position_y?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "family_relationships_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_relationships_related_person_id_fkey"
            columns: ["related_person_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      family_stories: {
        Row: {
          ai_summary: string | null
          content: string | null
          created_at: string
          file_url: string | null
          id: string
          is_age_sensitive: boolean | null
          keywords: string[] | null
          parent_id: string
          related_member_ids: string[] | null
          story_type: Database["public"]["Enums"]["family_story_type"]
          title: string
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          is_age_sensitive?: boolean | null
          keywords?: string[] | null
          parent_id: string
          related_member_ids?: string[] | null
          story_type: Database["public"]["Enums"]["family_story_type"]
          title: string
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          content?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          is_age_sensitive?: boolean | null
          keywords?: string[] | null
          parent_id?: string
          related_member_ids?: string[] | null
          story_type?: Database["public"]["Enums"]["family_story_type"]
          title?: string
          updated_at?: string
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
      kids_invites: {
        Row: {
          child_id: string
          created_at: string
          expires_at: string | null
          id: string
          invite_code: string
          is_active: boolean | null
          max_uses: number | null
          used_count: number | null
        }
        Insert: {
          child_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          invite_code: string
          is_active?: boolean | null
          max_uses?: number | null
          used_count?: number | null
        }
        Update: {
          child_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          invite_code?: string
          is_active?: boolean | null
          max_uses?: number | null
          used_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kids_invites_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kids_sessions: {
        Row: {
          child_id: string
          created_at: string
          device_info: string | null
          expires_at: string
          id: string
          last_activity_at: string | null
          session_token: string
        }
        Insert: {
          child_id: string
          created_at?: string
          device_info?: string | null
          expires_at: string
          id?: string
          last_activity_at?: string | null
          session_token: string
        }
        Update: {
          child_id?: string
          created_at?: string
          device_info?: string | null
          expires_at?: string
          id?: string
          last_activity_at?: string | null
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "kids_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_validation_logs: {
        Row: {
          action_taken: string
          child_id: string
          created_at: string | null
          flag_level: string
          flag_reasons: Json | null
          id: string
          message: string
          parent_notified: boolean | null
          validation_stage: string
        }
        Insert: {
          action_taken: string
          child_id: string
          created_at?: string | null
          flag_level: string
          flag_reasons?: Json | null
          id?: string
          message: string
          parent_notified?: boolean | null
          validation_stage: string
        }
        Update: {
          action_taken?: string
          child_id?: string
          created_at?: string | null
          flag_level?: string
          flag_reasons?: Json | null
          id?: string
          message?: string
          parent_notified?: boolean | null
          validation_stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_validation_logs_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "child_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      parent_subscriptions: {
        Row: {
          billing_cycle_end: string
          billing_cycle_start: string
          created_at: string
          id: string
          parent_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          storage_limit_mb: number
          storage_used_mb: number | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          transcription_limit_minutes: number
          transcription_used_minutes: number | null
          updated_at: string
        }
        Insert: {
          billing_cycle_end: string
          billing_cycle_start: string
          created_at?: string
          id?: string
          parent_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          storage_limit_mb: number
          storage_used_mb?: number | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          transcription_limit_minutes: number
          transcription_used_minutes?: number | null
          updated_at?: string
        }
        Update: {
          billing_cycle_end?: string
          billing_cycle_start?: string
          created_at?: string
          id?: string
          parent_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          storage_limit_mb?: number
          storage_used_mb?: number | null
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          transcription_limit_minutes?: number
          transcription_used_minutes?: number | null
          updated_at?: string
        }
        Relationships: []
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
      ui_icons: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          has_animation: boolean | null
          icon_gradient: string | null
          icon_name: string
          icon_primary: string
          icon_secondary: string | null
          icon_slug: string
          id: string
          size_px: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          has_animation?: boolean | null
          icon_gradient?: string | null
          icon_name: string
          icon_primary: string
          icon_secondary?: string | null
          icon_slug: string
          id?: string
          size_px?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          has_animation?: boolean | null
          icon_gradient?: string | null
          icon_name?: string
          icon_primary?: string
          icon_secondary?: string | null
          icon_slug?: string
          id?: string
          size_px?: number | null
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
      check_and_award_journey_badges: {
        Args: { p_child_id: string }
        Returns: undefined
      }
      check_storage_quota: {
        Args: { p_file_size_bytes: number; p_parent_id: string }
        Returns: boolean
      }
      check_transcription_quota: {
        Args: { p_duration_minutes: number; p_parent_id: string }
        Returns: boolean
      }
      reset_monthly_transcription_usage: { Args: never; Returns: undefined }
      update_child_streak: { Args: { p_child_id: string }; Returns: undefined }
    }
    Enums: {
      age_restriction_level: "all" | "age_8_plus" | "age_12_plus"
      family_story_type: "text" | "audio" | "document"
      subscription_status: "active" | "cancelled" | "expired"
      subscription_type:
        | "family_history_basic"
        | "family_history_plus"
        | "family_history_pro"
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
    Enums: {
      age_restriction_level: ["all", "age_8_plus", "age_12_plus"],
      family_story_type: ["text", "audio", "document"],
      subscription_status: ["active", "cancelled", "expired"],
      subscription_type: [
        "family_history_basic",
        "family_history_plus",
        "family_history_pro",
      ],
    },
  },
} as const
