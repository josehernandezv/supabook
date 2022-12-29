export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          created_at: string | null
          content: string
          image: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          content: string
          image?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          content?: string
          image?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
