import admin from 'firebase-admin';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

try {
  if (!admin.apps.length) {
    initializeApp({
      credential: applicationDefault(),
    });
  }
} catch (error) {
  console.error('Firebase admin initialization error', error);
}

export const auth = admin.auth();
export const db = admin.firestore();

export const getUserClaims = async (uid) => {
  try {
    const user = await auth.getUser(uid);
    return user.customClaims;
  } catch (error) {
    console.error('Error fetching user claims:', error);
    throw error;
  }
};