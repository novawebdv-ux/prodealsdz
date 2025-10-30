# ProDeals

## Overview
ProDeals هو منصة جزائرية بسيطة لبيع المنتجات الرقمية، مبني بـ Next.js 14. يتضمن واجهة عامة للعملاء ولوحة تحكم بسيطة للإدارة.

## Project Architecture
- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Storage**: localStorage (client-side only)
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
│   └── data.ts             # Types & initial data
├── public/
│   └── images/
│       └── logo.png        # شعار ProDeals
├── backup/                 # نسخة احتياطية من المشروع القديم
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Features

### الواجهة العامة (/)
- عرض المنتجات من localStorage
- البحث والتصفية
- سلة تسوق تفاعلية
- نموذج إرسال الطلبات
- تصميم متجاوب بالكامل
- أنيميشن احترافي للشعار باستخدام Framer Motion
- تدرج لوني من أزرق سماوي إلى أبيض

### لوحة التحكم (/admin)
- **نظام المصادقة**: تسجيل دخول بسيط
  - البريد: admin@prodeals.dz
  - كلمة المرور: admin123
- **إدارة الطلبات**: 
  - عرض جميع الطلبات
  - تأكيد أو رفض الطلبات
  - تفاصيل كاملة لكل طلب
- **إدارة المنتجات**:
  - إضافة منتجات جديدة
  - تعديل المنتجات الموجودة
  - حذف المنتجات

## Data Storage

يستخدم المشروع `localStorage` لتخزين:
- `prodeals_products`: قائمة المنتجات
- `prodeals_orders`: قائمة الطلبات
- `prodeals_admin_logged_in`: حالة تسجيل دخول الأدمن (sessionStorage)

## Setup Instructions

### في Replit (Development):
1. المشروع جاهز للعمل مباشرة
2. لا حاجة لإعداد قاعدة بيانات
3. شغّل `npm run dev`

### تغيير بيانات الأدمن:
عدّل ملف `lib/data.ts` وغيّر `DEFAULT_ADMIN`

### للنشر على Vercel:
1. ربط المشروع مع GitHub
2. استيراد المشروع في Vercel
3. النشر مباشرة (لا حاجة لمتغيرات بيئية)

## Workflow Configuration
- الـ workflow الحالي يشغل Next.js dev server على المنفذ 5000
- Command: `npm run dev`
- Output type: webview
- Port: 5000

## Recent Changes
- 2025-10-30: إزالة Supabase بالكامل
  - تحويل من Supabase إلى localStorage
  - تبسيط نظام المصادقة
  - إزالة جميع التبعيات الخارجية للقاعدة
  - المشروع الآن standalone تماماً

## Important Notes
- المشروع مُعد للاستضافة على Vercel
- لا يحتاج إلى أي إعداد خارجي
- جميع البيانات محلية في المتصفح
- مناسب للمشاريع الصغيرة والنماذج الأولية
