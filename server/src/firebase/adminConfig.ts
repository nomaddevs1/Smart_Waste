import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

if (admin.apps.length === 0) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
    }
  const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii'));
 
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: process.env.DATABASE_URL
    });
}

export const db = admin.firestore();


