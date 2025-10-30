# ProDeals - منصة المنتجات الرقمية

منصة جزائرية متكاملة لبيع المنتجات الرقمية مع لوحة تحكم إدارية شاملة.

## المميزات

### للعملاء:
- تصفح المنتجات الرقمية
- إضافة المنتجات للسلة
- إرسال الطلبات
- واجهة باللغة العربية مع تصميم حديث

### للإدارة (لوحة التحكم):
- إدارة المنتجات (إضافة، تعديل، حذف)
- استقبال الطلبات وتأكيدها أو رفضها
- إدارة حسابات المسؤولين
- نظام مصادقة آمن

## التقنيات المستخدمة

- **Frontend**: Next.js 14, TypeScript, React
- **Backend/Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Hosting**: Vercel
- **Styling**: CSS Modules

## الإعداد والتثبيت

### 1. إعداد Supabase

1. قم بإنشاء حساب على [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. انتقل إلى SQL Editor وقم بتشغيل الكود الموجود في `lib/database.sql`
4. احصل على:
   - Project URL
   - Anon Public Key

### 2. إعداد المتغيرات البيئية

انسخ `.env.local.example` إلى `.env.local` وقم بملء القيم:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. تثبيت المكتبات

```bash
npm install
```

### 4. تشغيل المشروع محلياً

```bash
npm run dev
```

سيتم تشغيل المشروع على `http://localhost:5000`

### 5. إنشاء أول حساب أدمن

بعد تشغيل SQL schema، قم بتسجيل حساب جديد في Supabase Auth، ثم أضف البريد الإلكتروني في جدول `admins`:

```sql
INSERT INTO admins (id, email) 
VALUES ('user_id_from_auth_users', 'admin@example.com');
```

## النشر على Vercel

1. قم بربط المشروع مع GitHub
2. استورد المشروع في [Vercel](https://vercel.com)
3. أضف المتغيرات البيئية في إعدادات Vercel
4. انشر المشروع

## الاستخدام

### الصفحة الرئيسية
- `/` - عرض المنتجات والتسوق

### لوحة التحكم
- `/admin` - تسجيل دخول الإدارة
  - علامة "الطلبات": عرض وإدارة الطلبات
  - علامة "المنتجات": إدارة كاتالوج المنتجات
  - علامة "المسؤولين": إضافة مسؤولين جدد

## الأمان

- استخدام Row Level Security (RLS) في Supabase
- المصادقة عبر Supabase Auth
- صلاحيات محددة للإدارة فقط

## الدعم

للمساعدة أو الاستفسارات، يرجى التواصل معنا.

---

© 2025 ProDeals - جميع الحقوق محفوظة
