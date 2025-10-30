import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  title: string
  description: string
  price: number
  image_url?: string
  created_at: string
}

export type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  products: any
  total: number
  status: 'pending' | 'confirmed' | 'rejected'
  created_at: string
}

export type Admin = {
  id: string
  email: string
  created_at: string
}
