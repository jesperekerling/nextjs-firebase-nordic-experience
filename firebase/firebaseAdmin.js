import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = admin.auth();

export const setCustomUserClaims = async (uid, claims) => {
  try {
    await auth.setCustomUserClaims(uid, claims);
    console.log(`Custom claims set for user ${uid}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
};

export const removeCustomUserClaims = async (uid) => {
  try {
    await auth.setCustomUserClaims(uid, { admin: null });
    console.log(`Custom claims removed for user ${uid}`);
  } catch (error) {
    console.error('Error removing custom claims:', error);
  }
};

export const verifyIdToken = async (token) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
};

export const getUserClaims = async (uid) => {
  try {
    const user = await auth.getUser(uid);
    return user.customClaims;
  } catch (error) {
    console.error('Error getting user claims:', error);
    return null;
  }
};

export default admin;