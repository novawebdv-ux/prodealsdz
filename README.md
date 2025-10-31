# ProDeals - منصة جزائرية للمنتجات الرقمية 🇩🇿

منصة حديثة ومتطورة لبيع المنتجات الرقمية في الجزائر، مبنية بتقنيات Next.js وFirebase.

## ✨ المميزات

### للعملاء:
- ✅ تصفح المنتجات الرقمية
- 🛒 نظام طلبات بسيط
- 💳 دفع عبر بريدي موب (CCP)
- 📦 تحميل المنتجات بعد التأكيد
- 🔐 تسجيل دخول آمن عبر Google
- 📱 واجهة باللغة العربية مع تصميم حديث
- ⚡ سرعة فائقة في التنقل بين الصفحات

### للإدارة (لوحة التحكم):
- ✅ إدارة المنتجات (إضافة، تعديل، حذف)
- ✅ استقبال الطلبات وتأكيدها أو رفضها
- 📊 عرض جميع الطلبات والمشتريات
- ⚙️ إدارة إعدادات CCP
- 🗑️ حذف تلقائي للطلبات بعد 7 أيام

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google)
- **Storage**: Firebase Storage
- **Hosting**: Vercel (موصى به)
- **Styling**: CSS Modules

## 📋 متطلبات التشغيل

- Node.js 18 أو أحدث
- حساب Firebase
- حساب Vercel (للنشر)

## 🔧 إعداد المشروع

### 1. إعداد Firebase

اتبع التعليمات الكاملة في ملف [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)

ملخص الخطوات:
1. أنشئ مشروع جديد في Firebase Console
2. فعّل Firebase Authentication (Google Provider)
3. فعّل Firestore Database
4. فعّل Firebase Storage
5. انسخ قواعد الأمان من ملف `firestore.rules`

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. إعداد المتغيرات البيئية

أنشئ ملف `.env.local` في المجلد الرئيسي:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

راجع ملف `.env.example` للمزيد من التفاصيل.

### 4. تشغيل المشروع

```bash
npm run dev
```

سيتم تشغيل المشروع على `http://localhost:3000`

## 🔐 صلاحيات المسؤول

البريد الإلكتروني للمسؤول الافتراضي: `admin@prodeals.dz`

لتغييره، عدّل دالة `isAdmin()` في ملف `firestore.rules`:

```javascript
function isAdmin() {
  return request.auth != null && 
         request.auth.token.email == 'your-admin@example.com';
}
```

## 🌐 النشر على Vercel

⚠️ **المشروع جاهز تماماً للنشر على Vercel!**

اتبع التعليمات الكاملة والمفصلة في ملف [`DEPLOYMENT.md`](./DEPLOYMENT.md)

### خطوات سريعة:
1. ارفع المشروع إلى GitHub/GitLab
2. سجل في [Vercel](https://vercel.com) وربط Git
3. استورد المشروع (Vercel سيكتشف Next.js تلقائياً)
4. أضف **جميع** المتغيرات البيئية في Vercel Settings
5. انشر المشروع
6. أضف دومين Vercel في Firebase Authorized Domains

## 💾 نظام البيانات

المشروع يستخدم Firebase Firestore مع 4 مجموعات:

1. **products** - المنتجات الرقمية (دائمة)
2. **orders** - الطلبات (تُحذف بعد 7 أيام)
3. **purchases** - المشتريات المؤكدة (دائمة)
4. **settings** - إعدادات CCP (دائمة)

## 📖 الاستخدام

### للعملاء:
1. سجّل الدخول بحساب Google
2. تصفح المنتجات في `/products`
3. اشترِ منتج وأرسل صورة الوصل
4. انتظر التأكيد من الإدارة
5. حمّل منتجك من `/my-purchases`

### للإدارة:
1. سجّل الدخول بحساب المسؤول (Google)
2. اذهب إلى `/admin`
3. راجع الطلبات وأكّدها أو ارفضها
4. أضف وعدّل المنتجات
5. حدّث إعدادات CCP

## 🔒 نظام الأمان

- ✅ قواعد Firestore محكمة
- ✅ صلاحيات المسؤول محددة بالبريد الإلكتروني
- ✅ المستخدمون يرون بياناتهم فقط
- ✅ المشتريات دائمة ولا يمكن حذفها
- ✅ الطلبات تُحذف تلقائياً بعد 7 أيام

## 🗑️ حذف الطلبات القديمة

يمكنك استدعاء API endpoint لحذف الطلبات القديمة:

```bash
GET/POST /api/orders/cleanup
```

يُنصح بإعداد Cron Job أو Cloud Function لتشغيله أسبوعياً.

---

© 2025 ProDeals - جميع الحقوق محفوظة
