// ProDeals - Local Data Types

export type Product = {
  id: string
  title: string
  description: string
  price: number
  image_url?: string
  discountPrice?: number
  discountEndDate?: string
}

export type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  products: Product[]
  total: number
  status: 'pending' | 'confirmed' | 'rejected'
  created_at: string
}

export type Admin = {
  email: string
  password: string
}

// Initial sample products
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'قالب موقع احترافي',
    description: 'قالب HTML/CSS بسيط وسهل التخصيص',
    price: 1200,
  },
  {
    id: 'p2',
    title: 'دورة برمجة جافاسكربت',
    description: 'دورة مكثفة للمبتدئين',
    price: 2500,
  },
  {
    id: 'p3',
    title: 'كتاب إلكتروني: تسويق رقمي',
    description: 'دليل عملي للتسويق عبر الإنترنت',
    price: 800,
  },
  {
    id: 'p4',
    title: 'مؤثرات صوتية لمواقع',
    description: 'حزمة مؤثرات بجودة عالية',
    price: 400,
  },
]

// Default admin credentials
export const DEFAULT_ADMIN: Admin = {
  email: 'admin@prodeals.dz',
  password: 'admin123',
}
