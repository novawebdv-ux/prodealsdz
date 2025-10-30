import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let app: App;
let db: Firestore;

if (!getApps().length) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: projectId,
    });
  } else {
    app = initializeApp({
      projectId: projectId,
    });
  }
  
  db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export const adminDb = db;
export const adminAuth = getAuth(app);
