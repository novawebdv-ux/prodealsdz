# دليل الإعداد الكامل لـ ProDeals

## المتطلبات الأساسية
1. حساب على [Supabase](https://supabase.com) - مجاني
2. حساب على [Vercel](https://vercel.com) - مجاني
3. حساب GitHub (اختياري لكن مُنصح به)

---

## الخطوة 1: إعداد قاعدة البيانات Supabase

### 1.1 إنشاء مشروع جديد
1. اذهب إلى https://supabase.com
2. سجل دخول أو أنشئ حساب جديد
3. اضغط على "New Project"
4. املأ التفاصيل:
   - اسم المشروع: `prodeals`
   - كلمة مرور قاعدة البيانات: احفظها في مكان آمن
   - المنطقة: اختر أقرب منطقة لك

### 1.2 تشغيل SQL Schema
1. في لوحة تحكم Supabase، اذهب إلى `SQL Editor`
2. اضغط على "New query"
3. انسخ كامل محتوى ملف `lib/database.sql`
4. الصقه في المحرر
5. اضغط على `Run` أو `Ctrl+Enter`
6. تأكد من ظهور رسالة "Success"

### 1.3 الحصول على API Keys
1. اذهب إلى `Settings` (الإعدادات)
2. اختر `API` من القائمة الجانبية
3. احفظ هذه القيم:
   - **Project URL**: مثل `https://xxxxx.supabase.co`
   - **Anon/Public Key**: مفتاح طويل يبدأ بـ `eyJ...`

⚠️ **مهم**: لا تشارك هذه المفاتيح مع أحد!

---

## الخطوة 2: إعداد المشروع محلياً

### 2.1 إنشاء ملف Environment Variables
1. في جذر المشروع، أنشئ ملف اسمه `.env.local`
2. أضف هذه الأسطر:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. استبدل القيم بالقيم الحقيقية من Supabase

### 2.2 تثبيت المكتبات
```bash
npm install
```

### 2.3 تشغيل المشروع
```bash
npm run dev
```

سيعمل الموقع على: http://localhost:5000

---

## الخطوة 3: إنشاء أول حساب أدمن

### 3.1 الطريقة الأولى (عبر Supabase Dashboard):
1. في Supabase Dashboard، اذهب إلى `Authentication` → `Users`
2. اضغط `Add user` → `Create new user`
3. أدخل البريد الإلكتروني وكلمة المرور
4. احفظ الـ User ID (UUID)
5. اذهب إلى `SQL Editor` وشغّل:

```sql
INSERT INTO admins (id, email) 
VALUES ('user-uuid-here', 'admin@example.com');
```

استبدل `user-uuid-here` بالـ UUID الذي حصلت عليه

### 3.2 الطريقة الثانية (عبر الموقع):
1. شغّل المشروع محلياً
2. اذهب إلى `/admin`
3. ستحتاج أولاً لإنشاء المستخدم في Supabase Auth (الخطوة 3.1 أعلاه)
4. ثم سجّل دخول بالبريد وكلمة المرور

---

## الخطوة 4: النشر على Vercel

### 4.1 ربط المشروع بـ GitHub (مُنصح به)
1. أنشئ repository جديد على GitHub
2. رفع الكود:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/prodeals.git
git push -u origin main
```

### 4.2 النشر على Vercel
1. اذهب إلى https://vercel.com
2. سجل دخول بحساب GitHub
3. اضغط `Add New...` → `Project`
4. اختر repository الخاص بك
5. في `Environment Variables`، أضف:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. اضغط `Deploy`

### 4.3 الحصول على الرابط
بعد النشر، ستحصل على رابط مثل:
`https://prodeals.vercel.app`

---

## الخطوة 5: الاستخدام

### للعملاء:
- الصفحة الرئيسية: `https://your-site.vercel.app`
- تصفح المنتجات
- إضافة للسلة
- إرسال طلب

### للإدارة:
- لوحة التحكم: `https://your-site.vercel.app/admin`
- تسجيل دخول بحساب الأدمن
- **علامة الطلبات**: عرض وإدارة الطلبات الواردة
- **علامة المنتجات**: إضافة/تعديل/حذف المنتجات
- **علامة المسؤولين**: إضافة مسؤولين جدد

---

## حل المشاكل الشائعة

### المشكلة: "Invalid API key"
**الحل**: تأكد من نسخ API keys بشكل صحيح في `.env.local`

### المشكلة: "Failed to fetch products"
**الحل**: تأكد من تشغيل SQL schema بنجاح في Supabase

### المشكلة: "ليس لديك صلاحيات أدمن"
**الحل**: تأكد من إضافة البريد الإلكتروني في جدول `admins`

### المشكلة: "Build failed on Vercel"
**الحل**: تأكد من إضافة Environment Variables في إعدادات Vercel

---

## نصائح مهمة

### الأمان
- ✅ لا تشارك ملف `.env.local` أبداً
- ✅ لا تضع API keys في الكود مباشرة
- ✅ استخدم كلمات مرور قوية للأدمن

### الأداء
- ✅ Vercel يدعم التحديثات التلقائية عند push للـ GitHub
- ✅ Supabase يعطيك 500 MB مساحة مجانية
- ✅ يمكنك ترقية الخطة لاحقاً عند الحاجة

### التطوير
- ✅ استخدم `npm run dev` للتطوير المحلي
- ✅ استخدم `npm run build` للتأكد من عدم وجود أخطاء قبل النشر
- ✅ راجع logs في Vercel عند وجود مشاكل

---

## الدعم والمساعدة

إذا واجهت أي مشكلة:
1. راجع الـ logs في Vercel Dashboard
2. تحقق من الـ SQL logs في Supabase
3. تأكد من تطابق Environment Variables

---

## ملاحظات نهائية

هذا المشروع جاهز للإنتاج ويشمل:
- ✅ نظام مصادقة آمن
- ✅ قاعدة بيانات PostgreSQL قوية
- ✅ واجهة مستخدم احترافية
- ✅ لوحة تحكم كاملة
- ✅ تصميم متجاوب
- ✅ أنيميشن سلس

**بالتوفيق في مشروعك! 🚀**
