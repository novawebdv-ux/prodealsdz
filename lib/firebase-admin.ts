import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';

let app: App | undefined;
let db: Firestore | undefined;

function initializeFirebase() {
  if (!getApps().length) {
    try {
      let serviceAccount;
      
      if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        try {
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        } catch (jsonError) {
          console.log('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON, falling back to config file');
          const configPath = path.join(process.cwd(), 'firebase-config.json');
          if (!fs.existsSync(configPath)) {
            console.warn('Firebase config file not found. Firebase will not be available.');
            return false;
          }
          const configFile = fs.readFileSync(configPath, 'utf8');
          const config = JSON.parse(configFile);
          serviceAccount = config.serviceAccount;
        }
      } else {
        const configPath = path.join(process.cwd(), 'firebase-config.json');
        if (!fs.existsSync(configPath)) {
          console.warn('Firebase config file not found. Firebase will not be available.');
          return false;
        }
        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configFile);
        serviceAccount = config.serviceAccount;
        
        if (serviceAccount.project_id === 'YOUR_PROJECT_ID' || 
            serviceAccount.private_key === 'YOUR_PRIVATE_KEY') {
          console.warn('Firebase credentials not configured. Firebase will not be available.');
          return false;
        }
      }
      
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      
      db = getFirestore(app);
      db.settings({ ignoreUndefinedProperties: true });
      return true;
    } catch (error) {
      console.error('Error loading firebase config:', error);
      console.warn('Firebase will not be available.');
      return false;
    }
  } else {
    app = getApps()[0];
    db = getFirestore(app);
    return true;
  }
}

function getAdminDb(): Firestore {
  if (!db) {
    initializeFirebase();
  }
  if (!db) {
    throw new Error('Firebase configuration not found. Please add FIREBASE_SERVICE_ACCOUNT_JSON secret or update firebase-config.json');
  }
  return db;
}

function getAdminAuth() {
  if (!app) {
    initializeFirebase();
  }
  if (!app) {
    throw new Error('Firebase configuration not found. Please add FIREBASE_SERVICE_ACCOUNT_JSON secret or update firebase-config.json');
  }
  return getAuth(app);
}

export const adminDb = new Proxy({} as Firestore, {
  get(target, prop) {
    return getAdminDb()[prop as keyof Firestore];
  }
});

export const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(target, prop) {
    return getAdminAuth()[prop as keyof ReturnType<typeof getAuth>];
  }
});
