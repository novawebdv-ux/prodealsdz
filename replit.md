# ProDeals

## Overview
ProDeals هو منصة جزائرية متكاملة لبيع المنتجات الرقمية، مبني بـ Next.js 14 و Supabase. يتضمن واجهة عامة للعملاء ولوحة تحكم كاملة للإدارة.

## Project Architecture
- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Animations**: Framer Motion
- **Styling**: CSS Modules + Global CSS
- **Deployment Target**: Vercel

## File Structure
```
.
├── app/
│   ├── layout.tsx          # Root layout (RTL, Arabic)
│   ├── page.tsx            # الصفحة الرئيسية - عرض المنتجات
│   ├── page.module.css     # تصميم الصفحة الرئيسية
│   ├── globals.css         # التصميم العام
│   └── admin/
│       ├── page.tsx        # لوحة تحكم الأدمن
│       └── admin.module.css
├── lib/
│   ├── supabase.ts         # إعداد Supabase client
│   └── database.sql        # Schema قاعدة البيانات
├── public/
│   └── images/
│       └── logo.png        # شعار ProDeals
├── components/             # المكونات القابلة لإعادة الاستخدام
├── backup/                 # نسخة احتياطية من المشروع القديم
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Features

### الواجهة العامة (/)
- عرض المنتجات الرقمية من قاعدة البيانات
- البحث والتصفية
- سلة تسوق تفاعلية
- نموذج إرسال الطلبات
- تصميم متجاوب بالكامل
- أنيميشن احترافي للشعار باستخدام Framer Motion
- تدرج لوني من أزرق سماوي إلى أبيض

### لوحة التحكم (/admin)
- **نظام المصادقة**: تسجيل دخول آمن للمسؤولين فقط
- **إدارة الطلبات**: 
  - عرض جميع الطلبات
  - تأكيد أو رفض الطلبات
  - تفاصيل كاملة لكل طلب
- **إدارة المنتجات**:
  - إضافة منتجات جديدة
  - تعديل المنتجات الموجودة
  - حذف المنتجات
- **إدارة المسؤولين**:
  - إضافة حسابات مسؤولين جديدة
  - عرض جميع المسؤولين

## Database Schema

### Products Table
- `id`: UUID (Primary Key)
- `title`: TEXT
- `description`: TEXT
- `price`: NUMERIC
- `image_url`: TEXT (optional)
- `created_at`: TIMESTAMP

### Orders Table
- `id`: UUID (Primary Key)
- `customer_name`: TEXT
- `customer_email`: TEXT
- `customer_phone`: TEXT
- `products`: JSONB (array of products)
- `total`: NUMERIC
- `status`: TEXT (pending/confirmed/rejected)
- `created_at`: TIMESTAMP

### Admins Table
- `id`: UUID (Foreign Key to auth.users)
- `email`: TEXT
- `created_at`: TIMESTAMP

## Setup Instructions

### في Replit (Development):
1. المشروع جاهز للعمل محلياً
2. لكن تحتاج إلى إعداد Supabase أولاً (انظر أدناه)
3. بعد إعداد Supabase، أضف متغيرات البيئة في Secrets

### إعداد Supabase:
1. إنشاء حساب في https://supabase.com
2. إنشاء مشروع جديد
3. تشغيل الكود في `lib/database.sql` في SQL Editor
4. الحصول على Project URL و Anon Key
5. إضافتهم في `.env.local` أو Replit Secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### إنشاء أول أدمن:
بعد تشغيل SQL schema:
1. قم بالتسجيل في Supabase Auth
2. أضف البريد الإلكتروني في جدول admins:
```sql
INSERT INTO admins (id, email) 
VALUES ('user_id_from_supabase_auth', 'admin@email.com');
```

### للنشر على Vercel:
1. ربط المشروع مع GitHub
2. استيراد المشروع في Vercel
3. إضافة Environment Variables
4. النشر التلقائي

## Workflow Configuration
- الـ workflow الحالي يشغل Next.js dev server على المنفذ 5000
- Command: `npm run dev`
- Output type: webview
- Port: 5000

## Recent Changes
- 2025-10-30: تحويل كامل للمشروع
  - تحويل من HTML/CSS/JS بسيط إلى Next.js 14
  - إضافة Supabase كـ backend
  - إضافة نظام مصادقة كامل
  - بناء لوحة تحكم إدارية شاملة
  - إضافة الشعار الجديد مع أنيميشن
  - تطبيق التصميم الجديد (أزرق سماوي → أبيض)
  - إضافة TypeScript للأمان
  - استخدام Framer Motion للأنيميشن

## Important Notes
- المشروع مُعد للاستضافة على Vercel (وليس Replit Deployments)
- يحتاج إلى Supabase account ليعمل بشكل كامل
- جميع الميزات جاهزة ومتكاملة
- الأمان مطبق عبر RLS في Supabase
