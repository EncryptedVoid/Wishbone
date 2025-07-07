// src/lib/database.types.ts
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          username: string
          nickname: string | null
          favorite_color: string
          dark_mode: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          nickname?: string | null
          favorite_color?: string
          dark_mode?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          nickname?: string | null
          favorite_color?: string
          dark_mode?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
