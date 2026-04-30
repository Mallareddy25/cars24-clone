import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if Firebase is configured before initializing
const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let messaging = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    if (typeof window !== "undefined") {
      messaging = getMessaging(app);
    }
  } catch (e) {
    console.warn("Firebase initialization failed (missing config):", e);
  }
}

export const requestForToken = async () => {
  if (!messaging || typeof window === "undefined") return null;
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE'
    });
    if (currentToken) {
      console.log('FCM Token generated:', currentToken);
      return currentToken;
    }
  } catch (err) {
    console.log('[MOCK] FCM token generation failed (expected with dummy keys)', err);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (!messaging || typeof window === "undefined") {
      return reject("Firebase messaging not initialized");
    }
    onMessage(messaging, (payload) => {
      console.log("Foreground notification received:", payload);
      resolve(payload);
    });
  });

export { app, messaging };
