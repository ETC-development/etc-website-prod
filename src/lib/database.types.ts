export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
        }
        Relationships: []
      }
      applications: {
        Row: {
          about: string
          assigned_cell: Database["public"]["Enums"]["cell"] | null
          choice_1: Database["public"]["Enums"]["cell"]
          choice_2: Database["public"]["Enums"]["cell"] | null
          choice_3: Database["public"]["Enums"]["cell"] | null
          created_at: string
          discord: string | null
          email: string
          first_name: string
          id: number
          last_name: string
          level: Database["public"]["Enums"]["study_year"]
          link_1: string | null
          link_2: string | null
          made: string
          motivation_1: string
          motivation_2: string | null
          motivation_3: string | null
          phone: string
          reviewer_notes: string | null
          school: Database["public"]["Enums"]["school"]
          school_other: string | null
          season: string
          status: Database["public"]["Enums"]["application_status"]
          user_id: string
          why: string
        }
        Insert: {
          about: string
          assigned_cell?: Database["public"]["Enums"]["cell"] | null
          choice_1: Database["public"]["Enums"]["cell"]
          choice_2?: Database["public"]["Enums"]["cell"] | null
          choice_3?: Database["public"]["Enums"]["cell"] | null
          created_at?: string
          discord?: string | null
          email?: string
          first_name: string
          id?: number
          last_name: string
          level: Database["public"]["Enums"]["study_year"]
          link_1?: string | null
          link_2?: string | null
          made: string
          motivation_1: string
          motivation_2?: string | null
          motivation_3?: string | null
          phone: string
          reviewer_notes?: string | null
          school: Database["public"]["Enums"]["school"]
          school_other?: string | null
          season?: string
          status?: Database["public"]["Enums"]["application_status"]
          user_id?: string
          why: string
        }
        Update: {
          about?: string
          assigned_cell?: Database["public"]["Enums"]["cell"] | null
          choice_1?: Database["public"]["Enums"]["cell"]
          choice_2?: Database["public"]["Enums"]["cell"] | null
          choice_3?: Database["public"]["Enums"]["cell"] | null
          created_at?: string
          discord?: string | null
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          level?: Database["public"]["Enums"]["study_year"]
          link_1?: string | null
          link_2?: string | null
          made?: string
          motivation_1?: string
          motivation_2?: string | null
          motivation_3?: string | null
          phone?: string
          reviewer_notes?: string | null
          school?: Database["public"]["Enums"]["school"]
          school_other?: string | null
          season?: string
          status?: Database["public"]["Enums"]["application_status"]
          user_id?: string
          why?: string
        }
        Relationships: []
      }
      club_info: {
        Row: {
          address_link: string
          address_text: string
          club_description: string
          club_id: number
          discord_link: string
          email: string
          facebook_link: string
          github_link: string
          insta_link: string
          linkedin_link: string
          newsletter_desc: string
          newsletter_subtitle: string
          newsletter_title: string
          num_events: number
          num_members: number
          num_participants: number
          num_projects: number
          num_stands: number
          phone: string
          twitter_link: string
        }
        Insert: {
          address_link: string
          address_text: string
          club_description: string
          club_id?: number
          discord_link: string
          email: string
          facebook_link: string
          github_link: string
          insta_link: string
          linkedin_link: string
          newsletter_desc: string
          newsletter_subtitle: string
          newsletter_title: string
          num_events: number
          num_members: number
          num_participants: number
          num_projects: number
          num_stands: number
          phone: string
          twitter_link: string
        }
        Update: {
          address_link?: string
          address_text?: string
          club_description?: string
          club_id?: number
          discord_link?: string
          email?: string
          facebook_link?: string
          github_link?: string
          insta_link?: string
          linkedin_link?: string
          newsletter_desc?: string
          newsletter_subtitle?: string
          newsletter_title?: string
          num_events?: number
          num_members?: number
          num_participants?: number
          num_projects?: number
          num_stands?: number
          phone?: string
          twitter_link?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          description: string
          id: number
          logo_link: string
          subtitle: string | null
          title: string
        }
        Insert: {
          description: string
          id?: number
          logo_link: string
          subtitle?: string | null
          title: string
        }
        Update: {
          description?: string
          id?: number
          logo_link?: string
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      "managers-2k25-2k26": {
        Row: {
          description: string
          education_level: string
          email: string
          fullname: string
          github_link: string
          linkedin_link: string
          manager_id: number
          profile_pic_url: string
          role: string
        }
        Insert: {
          description: string
          education_level: string
          email: string
          fullname: string
          github_link: string
          linkedin_link: string
          manager_id?: number
          profile_pic_url: string
          role: string
        }
        Update: {
          description?: string
          education_level?: string
          email?: string
          fullname?: string
          github_link?: string
          linkedin_link?: string
          manager_id?: number
          profile_pic_url?: string
          role?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          description: string
          id: number
          logo_link: string
          subtitle: string | null
          title: string
        }
        Insert: {
          description: string
          id?: number
          logo_link: string
          subtitle?: string | null
          title: string
        }
        Update: {
          description?: string
          id?: number
          logo_link?: string
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      registration_settings: {
        Row: {
          id: boolean
          is_open: boolean
          season: string
        }
        Insert: {
          id?: boolean
          is_open?: boolean
          season: string
        }
        Update: {
          id?: boolean
          is_open?: boolean
          season?: string
        }
        Relationships: []
      }
      registration: {
        Row: {
          assigned_dep: Database["public"]["Enums"]["departments"] | null
          dep_first_choice: Database["public"]["Enums"]["departments"]
          dep_second_choice: Database["public"]["Enums"]["departments"]
          dep_third_choice: Database["public"]["Enums"]["departments"]
          discord: string
          discord_id: number | null
          email: string
          first_choice_motivation: string
          fullname: string
          github_portfolio: string | null
          id: number
          level: Database["public"]["Enums"]["level"]
          second_choice_motivation: string
          selection_justification: string
          self_description: string
          status: Database["public"]["Enums"]["status"] | null
          third_choice_motivation: string
        }
        Insert: {
          assigned_dep?: Database["public"]["Enums"]["departments"] | null
          dep_first_choice: Database["public"]["Enums"]["departments"]
          dep_second_choice: Database["public"]["Enums"]["departments"]
          dep_third_choice: Database["public"]["Enums"]["departments"]
          discord: string
          discord_id?: number | null
          email: string
          first_choice_motivation: string
          fullname: string
          github_portfolio?: string | null
          id?: number
          level: Database["public"]["Enums"]["level"]
          second_choice_motivation: string
          selection_justification: string
          self_description: string
          status?: Database["public"]["Enums"]["status"] | null
          third_choice_motivation: string
        }
        Update: {
          assigned_dep?: Database["public"]["Enums"]["departments"] | null
          dep_first_choice?: Database["public"]["Enums"]["departments"]
          dep_second_choice?: Database["public"]["Enums"]["departments"]
          dep_third_choice?: Database["public"]["Enums"]["departments"]
          discord?: string
          discord_id?: number | null
          email?: string
          first_choice_motivation?: string
          fullname?: string
          github_portfolio?: string | null
          id?: number
          level?: Database["public"]["Enums"]["level"]
          second_choice_motivation?: string
          selection_justification?: string
          self_description?: string
          status?: Database["public"]["Enums"]["status"] | null
          third_choice_motivation?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_season: { Args: never; Returns: string }
      word_count: { Args: { t: string }; Returns: number }
    }
    Enums: {
      application_status: "pending" | "accepted" | "rejected"
      cell:
        | "development"
        | "ai"
        | "design"
        | "multimedia"
        | "events"
        | "marketing"
        | "relex"
      school: "ENSIA" | "ESI" | "NHSM" | "ENCS" | "NHSAST" | "ESNN" | "ESTA" | "Other"
      study_year: "1Y" | "2Y" | "3Y" | "4Y" | "5Y" | "Other"
      departments:
        | "production_multimedia"
        | "finance"
        | "relex"
        | "dev"
        | "ai"
        | "ui_ux"
        | "graphic"
        | "planning_logistics"
      level: "1CP / 1L" | "2CP / 2L" | "1CS / 3L" | "2CS / 1M" | "3CS / 2M"
      status: "accepted" | "pending" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]