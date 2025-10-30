# خطوات النشر السريع على Vercel

## الطريقة السريعة (بدون GitHub)

### 1. تثبيت Vercel CLI
```bash
npm install -g vercel
```

### 2. تسجيل الدخول
```bash
vercel login
```

### 3. النشر
```bash
vercel
```

اتبع الخطوات:
- "Set up and deploy"? → Yes
- "Which scope"? → اختر حسابك
- "Link to existing project"? → No
- "What's your project's name"? → prodeals
- "In which directory is your code located"? → ./
- "Want to modify these settings"? → No

### 4. إضافة Environment Variables
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

اختر `Production`, `Preview`, `Development` للجميع

### 5. إعادة النشر
```bash
vercel --prod
```

---

## التحديثات المستقبلية

بعد أي تعديل:
```bash
vercel --prod
```

---

## الحصول على الرابط

بعد النشر، ستحصل على رابطين:
- **Preview**: للمعاينة
- **Production**: الرابط النهائي

مثال:
```
https://prodeals.vercel.app
```

---

## ربط دومين خاص (اختياري)

1. في Vercel Dashboard
2. اختر المشروع
3. Settings → Domains
4. Add Domain
5. اتبع التعليمات

---

✅ **تم!** موقعك الآن مباشر على الإنترنت!
