import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';

let app: App;
let db: Firestore;

if (!getApps().length) {
  try {
    let serviceAccount;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      } catch (jsonError) {
        console.log('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON, falling back to config file');
        const configPath = path.join(process.cwd(), 'firebase-config.json');
        const configFile = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configFile);
        serviceAccount = config.serviceAccount;
      }
    } else {
      const configPath = path.join(process.cwd(), 'firebase-config.json');
      const configFile = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configFile);
      serviceAccount = config.serviceAccount;
      
      if (serviceAccount.project_id === 'YOUR_PROJECT_ID' || 
          serviceAccount.private_key === 'YOUR_PRIVATE_KEY') {
        throw new Error('Firebase credentials not configured');
      }
    }
    
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    
    db = getFirestore(app);
    db.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error('Error loading firebase config:', error);
    throw new Error('Firebase configuration not found. Please add FIREBASE_SERVICE_ACCOUNT_JSON secret or update firebase-config.json');
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export const adminDb = db;
export const adminAuth = getAuth(app);
