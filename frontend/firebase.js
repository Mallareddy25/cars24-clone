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

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let messaging;

if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export const requestForToken = async () => {
  if (typeof window !== "undefined") {
    try {
      const currentToken = await getToken(messaging, { 
        vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' // Replace with real VAPID key later 
      });
      if (currentToken) {
        console.log('FCM Token generated:', currentToken);
        // Send token to backend
        await fetch('http://localhost:5005/api/notifications/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: currentToken }),
        });
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } catch (err) {
      console.log('[MOCK] FCM token generation failed (expected with dummy keys)', err);
    }
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (typeof window !== "undefined") {
      onMessage(messaging, (payload) => {
        console.log("Foreground notification received:", payload);
        resolve(payload);
      });
    }
  });

export { app, messaging };
