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
      announcement_comments: {
        Row: {
          announcement_id: string
          author_name: string
          content: string
          created_at: string
          id: string
        }
        Insert: {
          announcement_id: string
          author_name: string
          content: string
          created_at?: string
          id?: string
        }
        Update: {
          announcement_id?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_comments_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "sale_announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_likes: {
        Row: {
          announcement_id: string
          author_name: string
          created_at: string
          id: string
        }
        Insert: {
          announcement_id: string
          author_name: string
          created_at?: string
          id?: string
        }
        Update: {
          announcement_id?: string
          author_name?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_likes_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "sale_announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          avgiftsklasse: string | null
          bagasjerom: string | null
          bilen_star_i: string | null
          chassis_nr: string | null
          co2_utslipp: string | null
          created_at: string
          dorer: string | null
          effekt: string | null
          farge: string | null
          features: Json | null
          finn_url: string | null
          forste_gang_registrert: string | null
          fuel: string | null
          hjuldrift: string | null
          id: string
          image_url: string | null
          karosseri: string | null
          make: string
          maksimal_tilhengervekt: string | null
          mileage: number | null
          model: string
          modell_year: string | null
          neste_eu_kontroll: string | null
          omregistrering: string | null
          owner_address: string | null
          owner_name: string | null
          owner_phone: string | null
          price: number | null
          pris_excl_omreg: string | null
          reasons: Json | null
          registration_number: string
          salgsform: string | null
          seter: string | null
          sist_eu_godkjent: string | null
          slagvolum: string | null
          transmission: string | null
          updated_at: string
          vekt: string | null
          year: number | null
        }
        Insert: {
          avgiftsklasse?: string | null
          bagasjerom?: string | null
          bilen_star_i?: string | null
          chassis_nr?: string | null
          co2_utslipp?: string | null
          created_at?: string
          dorer?: string | null
          effekt?: string | null
          farge?: string | null
          features?: Json | null
          finn_url?: string | null
          forste_gang_registrert?: string | null
          fuel?: string | null
          hjuldrift?: string | null
          id?: string
          image_url?: string | null
          karosseri?: string | null
          make: string
          maksimal_tilhengervekt?: string | null
          mileage?: number | null
          model: string
          modell_year?: string | null
          neste_eu_kontroll?: string | null
          omregistrering?: string | null
          owner_address?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          price?: number | null
          pris_excl_omreg?: string | null
          reasons?: Json | null
          registration_number: string
          salgsform?: string | null
          seter?: string | null
          sist_eu_godkjent?: string | null
          slagvolum?: string | null
          transmission?: string | null
          updated_at?: string
          vekt?: string | null
          year?: number | null
        }
        Update: {
          avgiftsklasse?: string | null
          bagasjerom?: string | null
          bilen_star_i?: string | null
          chassis_nr?: string | null
          co2_utslipp?: string | null
          created_at?: string
          dorer?: string | null
          effekt?: string | null
          farge?: string | null
          features?: Json | null
          finn_url?: string | null
          forste_gang_registrert?: string | null
          fuel?: string | null
          hjuldrift?: string | null
          id?: string
          image_url?: string | null
          karosseri?: string | null
          make?: string
          maksimal_tilhengervekt?: string | null
          mileage?: number | null
          model?: string
          modell_year?: string | null
          neste_eu_kontroll?: string | null
          omregistrering?: string | null
          owner_address?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          price?: number | null
          pris_excl_omreg?: string | null
          reasons?: Json | null
          registration_number?: string
          salgsform?: string | null
          seter?: string | null
          sist_eu_godkjent?: string | null
          slagvolum?: string | null
          transmission?: string | null
          updated_at?: string
          vekt?: string | null
          year?: number | null
        }
        Relationships: []
      }
      mottakskontroll: {
        Row: {
          agreement_pdf_path: string | null
          created_at: string
          id: string
          lead_id: string | null
          make: string
          model: string
          mottakskontroll_data: Json | null
          registration_number: string
          seller_name: string | null
          sent_date: string
          status: string
          tilstandskontroll_data: Json | null
          updated_at: string
          vask_foto_completed: boolean | null
          vask_foto_data: Json | null
          year: number | null
        }
        Insert: {
          agreement_pdf_path?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          make: string
          model: string
          mottakskontroll_data?: Json | null
          registration_number: string
          seller_name?: string | null
          sent_date: string
          status?: string
          tilstandskontroll_data?: Json | null
          updated_at?: string
          vask_foto_completed?: boolean | null
          vask_foto_data?: Json | null
          year?: number | null
        }
        Update: {
          agreement_pdf_path?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          make?: string
          model?: string
          mottakskontroll_data?: Json | null
          registration_number?: string
          seller_name?: string | null
          sent_date?: string
          status?: string
          tilstandskontroll_data?: Json | null
          updated_at?: string
          vask_foto_completed?: boolean | null
          vask_foto_data?: Json | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mottakskontroll_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_announcements: {
        Row: {
          author_name: string
          buyer_cost: number | null
          car_make: string
          car_model: string
          created_at: string
          extras: string | null
          id: string
          notes: string | null
          profit: number | null
          registration_number: string
          seller_name: string
          sold_price: number
          total_amount: number
        }
        Insert: {
          author_name: string
          buyer_cost?: number | null
          car_make: string
          car_model: string
          created_at?: string
          extras?: string | null
          id?: string
          notes?: string | null
          profit?: number | null
          registration_number: string
          seller_name: string
          sold_price: number
          total_amount: number
        }
        Update: {
          author_name?: string
          buyer_cost?: number | null
          car_make?: string
          car_model?: string
          created_at?: string
          extras?: string | null
          id?: string
          notes?: string | null
          profit?: number | null
          registration_number?: string
          seller_name?: string
          sold_price?: number
          total_amount?: number
        }
        Relationships: []
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
