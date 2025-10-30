import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';

let app: App;
let db: Firestore;

if (!getApps().length) {
  try {
    const configPath = path.join(process.cwd(), 'firebase-config.json');
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFile);
    
    app = initializeApp({
      credential: cert(config.serviceAccount),
      projectId: config.serviceAccount.project_id,
    });
    
    db = getFirestore(app);
    db.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error('Error loading firebase config:', error);
    throw new Error('Firebase configuration file not found. Please create firebase-config.json');
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export const adminDb = db;
export const adminAuth = getAuth(app);
