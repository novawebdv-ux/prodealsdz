# دليل نشر الموقع على Vercel 🚀

## خطوات النشر على Vercel

### 1. إعداد حساب Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل الدخول باستخدام GitHub أو GitLab أو Bitbucket
3. قم بربط حساب Git الخاص بك

### 2. رفع المشروع إلى Git
إذا لم يكن المشروع على Git بعد:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 3. استيراد المشروع في Vercel
1. من لوحة التحكم في Vercel، اضغط على **"New Project"**
2. اختر المستودع (Repository) الخاص بالمشروع
3. Vercel سيكتشف تلقائياً أن المشروع Next.js

### 4. إعداد المتغيرات البيئية (Environment Variables)

**مهم جداً:** يجب إضافة جميع المتغيرات البيئية التالية:

#### متغيرات Firebase Client (للواجهة الأمامية):
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### متغيرات Firebase Admin (للخادم):
```
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

**كيفية الحصول على Firebase Config:**
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. من الإعدادات → Your apps → Web app configuration
4. انسخ القيم

### 5. إعدادات النشر (Build Settings)

Vercel سيقوم بإعداد هذه تلقائياً، لكن تأكد من:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 6. نشر المشروع

اضغط على **"Deploy"** وانتظر حتى ينتهي البناء (Build).

### 7. إعداد Firebase Authorized Domains

بعد النشر، ستحصل على رابط من Vercel مثل:
```
https://your-app.vercel.app
```

**يجب إضافة هذا الدومين في Firebase:**

1. اذهب إلى Firebase Console
2. **Authentication** → **Settings** → **Authorized domains**
3. اضغط **Add domain**
4. أضف: `your-app.vercel.app`
5. إذا كان لديك دومين مخصص، أضفه أيضاً

### 8. إعداد Domain مخصص (اختياري)

في Vercel:
1. اذهب إلى **Settings** → **Domains**
2. اضغط **Add Domain**
3. اتبع التعليمات لربط الدومين الخاص بك
4. لا تنسى إضافة الدومين المخصص في Firebase Authorized Domains

## إعادة النشر (Redeploy)

كل مرة تقوم بعمل Push إلى Git:
- Vercel سيقوم تلقائياً ببناء ونشر النسخة الجديدة
- يمكنك أيضاً إعادة النشر يدوياً من لوحة التحكم

## حل المشاكل الشائعة

### مشكلة: خطأ في Firebase Auth
**الحل:** تأكد من إضافة دومين Vercel في Firebase Authorized Domains

### مشكلة: المتغيرات البيئية غير موجودة
**الحل:** 
1. تحقق من أن جميع المتغيرات مضافة في Vercel Settings → Environment Variables
2. تأكد من أن المتغيرات التي تبدأ بـ `NEXT_PUBLIC_` تُستخدم في الكود من جانب العميل فقط

### مشكلة: الصور لا تُحمّل
**الحل:** تأكد من أن `next.config.js` يحتوي على `remotePatterns` صحيح

## الأمان

⚠️ **تحذير مهم:**
- لا ترفع أبداً ملف `.env` إلى Git
- لا تشارك Firebase API Keys علناً
- استخدم Environment Variables في Vercel للمعلومات الحساسة

## الدعم

إذا واجهت أي مشكلة:
1. راجع [Vercel Documentation](https://vercel.com/docs)
2. راجع [Next.js Documentation](https://nextjs.org/docs)
3. تحقق من Logs في Vercel Dashboard → Deployments → اختر Deployment → Runtime Logs

---

✅ **جاهز للنشر!** المشروع مُعد بالكامل للاستضافة على Vercel.
