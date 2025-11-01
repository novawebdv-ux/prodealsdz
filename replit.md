# ProDeals

## Overview
ProDeals هو منصة جزائرية بسيطة لبيع المنتجات الرقمية، مبني بـ Next.js 14. يتضمن واجهة عامة للعملاء ولوحة تحكم بسيطة للإدارة.

## Project Architecture
- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Login)
- **Image Hosting**: ImgBB API (لرفع صور الإيصالات)
- **Animations**: CSS Animations (محسّن للأداء)
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
- أنيميشن احترافي وسريع باستخدام CSS
- تدرج لوني من أزرق سماوي إلى أبيض
- تحميل سريع ومحسّن للأداء

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

يستخدم المشروع Firebase Firestore مع المجموعات التالية:
- **products**: المنتجات الرقمية (دائمة)
- **orders**: الطلبات (تُحذف تلقائياً بعد 7 أيام)
- **purchases**: المشتريات المؤكدة (دائمة - لا تُحذف أبداً)
- **settings**: إعدادات CCP (دائمة)

## Setup Instructions

### في Replit (Development):
1. إعداد Firebase:
   - افتح Firebase Console وأنشئ مشروع جديد
   - فعّل Firebase Authentication (Google Provider)
   - فعّل Firestore Database
   - أضف إعدادات Firebase في Replit Secrets
2. إعداد ImgBB:
   - اذهب إلى https://api.imgbb.com/
   - سجل حساب مجاني واحصل على API Key
   - أضف `IMGBB_API_KEY` إلى Replit Secrets
3. راجع ملف `FIREBASE_SETUP.md` للتفاصيل الكاملة
4. شغّل `npm run dev`

### تغيير بيانات الأدمن:
عدّل ملف `firestore.rules` وغيّر البريد الإلكتروني في دالة `isAdmin()`

### للنشر على Vercel:
1. ربط المشروع مع GitHub
2. استيراد المشروع في Vercel
3. إضافة المتغيرات البيئية من Replit Secrets
4. النشر

## Workflow Configuration
- الـ workflow الحالي يشغل Next.js dev server على المنفذ 5000
- Command: `npm run dev`
- Output type: webview
- Port: 5000

## Recent Changes
- 2025-11-01: تكامل imgbb API لرفع صور الإيصالات
  - تحديث `/api/upload` لاستخدام imgbb API بدلاً من التخزين المحلي
  - تحويل الصور إلى base64 ورفعها إلى imgbb
  - الحصول على روابط دائمة للصور المرفوعة
  - تحسين معالجة الأخطاء والتحقق من صحة الاستجابات
  - استخدام آمن لمفتاح API من متغيرات البيئة

- 2025-10-31: تحسينات الأداء الرئيسية (المرحلة 2)
  - إضافة Loading States لجميع الصفحات
  - إزالة framer-motion بالكامل من المشروع
  - تحويل صفحة About إلى Server Component
  - إنشاء مكون LoadingSpinner مشترك
  - تحسين Fast Refresh وسرعة إعادة التحميل
  - تقليل حجم bundle بشكل كبير (3 packages أقل)

- 2025-10-31: تحسينات الأداء الرئيسية (المرحلة 1)
  - إزالة framer-motion من الصفحة الرئيسية وصفحة المنتجات
  - استبدال animations بـ CSS keyframes محسّنة
  - إضافة lazy loading للصور
  - تحسين سرعة التحميل وتجربة التصفح بشكل ملحوظ
  - تقليل حجم JavaScript bundle
  
- 2025-10-30: التحويل الكامل إلى Firebase Firestore
  - تحويل من PostgreSQL/Drizzle إلى Firebase Firestore
  - إعداد Firebase Admin SDK للاستخدام من server-side
  - تطبيق قواعد أمان Firestore محكمة
  - إضافة endpoint لحذف الطلبات القديمة تلقائياً
  - تحديث جميع الـ interfaces لتدعم string IDs
  - نظام آمن للمشتريات الدائمة والطلبات المؤقتة

## Important Notes
- المشروع مُعد للاستضافة على Vercel
- يحتاج إلى Firebase Project وإعداد متغيرات بيئية
- الطلبات تُحذف تلقائياً بعد 7 أيام
- المشتريات والمنتجات دائمة ولا تُحذف
- نظام أمان محكم مع قواعد Firestore
