import admin from 'firebase-admin';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

if (!admin.apps.length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

export const auth = admin.auth();
export const db = admin.firestore();