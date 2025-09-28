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
      accounts: {
        Row: {
          balance: number
          created_at: string
          id: string
          name: string
          type: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          name: string
          type: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      assets: {
        Row: {
          acquisition_date: string
          acquisition_value: number
          brand: string | null
          category: string
          condition: string | null
          created_at: string
          current_value: number | null
          id: string
          location: string | null
          model: string | null
          name: string
          notes: string | null
          serial_number: string | null
          user_id: string
          warranty_expiration: string | null
        }
        Insert: {
          acquisition_date: string
          acquisition_value: number
          brand?: string | null
          category: string
          condition?: string | null
          created_at?: string
          current_value?: number | null
          id?: string
          location?: string | null
          model?: string | null
          name: string
          notes?: string | null
          serial_number?: string | null
          user_id: string
          warranty_expiration?: string | null
        }
        Update: {
          acquisition_date?: string
          acquisition_value?: number
          brand?: string | null
          category?: string
          condition?: string | null
          created_at?: string
          current_value?: number | null
          id?: string
          location?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          serial_number?: string | null
          user_id?: string
          warranty_expiration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          name: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          name?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          name?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      refuelings: {
        Row: {
          created_at: string
          date: string
          fuel_type: string
          id: number
          liters: number
          odometer: number
          price_per_liter: number
          total_cost: number
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          date: string
          fuel_type: string
          id?: number
          liters: number
          odometer: number
          price_per_liter: number
          total_cost: number
          vehicle_id: string
        }
        Update: {
          created_at?: string
          date?: string
          fuel_type?: string
          id?: number
          liters?: number
          odometer?: number
          price_per_liter?: number
          total_cost?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "refuelings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          is_recurring: boolean
          notes: string | null
          type: string
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          is_recurring?: boolean
          notes?: string | null
          type: string
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_recurring?: boolean
          notes?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      vehicle_maintenances: {
        Row: {
          cost: number
          created_at: string
          date: string
          id: number
          notes: string | null
          odometer: number
          provider: string | null
          type: string
          vehicle_id: string
        }
        Insert: {
          cost: number
          created_at?: string
          date: string
          id?: number
          notes?: string | null
          odometer: number
          provider?: string | null
          type: string
          vehicle_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          date?: string
          id?: number
          notes?: string | null
          odometer?: number
          provider?: string | null
          type?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_maintenances_vehicle_id_fkey"
            columns: ["vehicle_id"]
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          }
        ]
      }
      vehicles: {
        Row: {
          brand: string
          created_at: string
          fuel_type: string
          id: string
          insurance_renewal_date: string | null
          license_plate: string
          licensing_date: string | null
          model: string
          name: string
          odometer: number
          type: string
          user_id: string
          year: number
        }
        Insert: {
          brand: string
          created_at?: string
          fuel_type: string
          id?: string
          insurance_renewal_date?: string | null
          license_plate: string
          licensing_date?: string | null
          model: string
          name: string
          odometer: number
          type: string
          user_id: string
          year: number
        }
        Update: {
          brand?: string
          created_at?: string
          fuel_type?: string
          id?: string
          insurance_renewal_date?: string | null
          license_plate?: string
          licensing_date?: string | null
          model?: string
          name?: string
          odometer?: number
          type?: string
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
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

export type Profile = Database['public']['Tables']['profiles']['Row'];
