# دليل إعداد Firebase Firestore

## 1. إعداد قواعد Firestore Security Rules

انسخ محتوى ملف `firestore.rules` والصقه في Firebase Console:

1. افتح [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. من القائمة الجانبية، اختر **Firestore Database**
4. اذهب إلى تبويب **Rules**
5. احذف القواعد الموجودة
6. الصق محتوى ملف `firestore.rules`
7. اضغط **Publish**

## 2. إعداد المتغيرات البيئية

تأكد من إضافة المتغيرات التالية في Replit Secrets:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### للاستخدام من Server-side (اختياري - للإنتاج):

إذا كنت تريد استخدام Firebase في بيئة الإنتاج بشكل آمن، أضف:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"..."}
```

للحصول على Service Account:
1. افتح Firebase Console
2. اذهب إلى Project Settings > Service Accounts
3. اضغط "Generate New Private Key"
4. انسخ محتوى الملف JSON بالكامل والصقه في المتغير

## 3. إعداد حذف الطلبات التلقائي (اختياري)

لحذف الطلبات القديمة تلقائياً كل أسبوع، يمكنك استخدام إحدى الطرق التالية:

### الطريقة 1: استخدام Cron Job يدوياً

يمكنك إعداد cron job لاستدعاء API endpoint التالي:

```
GET/POST https://your-domain.com/api/orders/cleanup
```

### الطريقة 2: استخدام Firebase Cloud Functions

أنشئ Cloud Function لحذف الطلبات تلقائياً:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.cleanupOldOrders = functions.pubsub
  .schedule('0 0 * * 0') // كل أحد عند منتصف الليل
  .timeZone('Africa/Algiers')
  .onRun(async (context) => {
    const db = admin.firestore();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    
    const oldOrders = await db.collection('orders')
      .where('createdAt', '<', cutoffDate)
      .get();
    
    const batch = db.batch();
    oldOrders.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`تم حذف ${oldOrders.size} طلب قديم`);
    
    return null;
  });
```

## 4. هيكل قاعدة البيانات

### Collections (المجموعات):

1. **products** - المنتجات (دائمة)
   - id: string
   - title: string
   - description: string
   - price: number
   - downloadLink: string (optional)
   - createdAt: timestamp

2. **orders** - الطلبات (تُحذف بعد 7 أيام)
   - id: string
   - customerEmail: string
   - customerName: string
   - customerPhone: string (optional)
   - productId: string
   - productTitle: string
   - productPrice: number
   - total: number
   - status: 'pending' | 'confirmed' | 'rejected'
   - receiptImageUrl: string (optional)
   - rejectionReason: string (optional)
   - createdAt: timestamp
   - updatedAt: timestamp

3. **purchases** - المشتريات (دائمة)
   - id: string
   - orderId: string
   - customerEmail: string
   - productId: string
   - productTitle: string
   - downloadLink: string
   - purchasedAt: timestamp

4. **settings** - الإعدادات (دائمة)
   - id: string
   - ccpNumber: string
   - ccpName: string
   - updatedAt: timestamp

## 5. إعداد صلاحيات المسؤول

القواعد الحالية تتحقق من البريد الإلكتروني للمسؤول (`admin@prodeals.dz`).

لتغيير البريد الإلكتروني للمسؤول، عدّل في ملف `firestore.rules`:

```javascript
function isAdmin() {
  return request.auth != null && 
         request.auth.token.email == 'your-admin-email@example.com';
}
```

**ملاحظة مهمة**: قم بتسجيل الدخول باستخدام Google بالبريد الإلكتروني للمسؤول للحصول على صلاحيات كاملة.

## 6. الأمان والصلاحيات

- ✅ **المنتجات**: الجميع يمكنه القراءة، المسؤولون فقط يمكنهم الكتابة
- ✅ **الطلبات**: المستخدمون يرون طلباتهم فقط، المسؤولون يرون كل الطلبات
- ✅ **المشتريات**: المستخدمون يرون مشترياتهم فقط، لا يمكن حذفها أو تعديلها
- ✅ **الإعدادات**: الجميع يمكنه القراءة، المسؤولون فقط يمكنهم التعديل
