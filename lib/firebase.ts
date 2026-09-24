import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator, Functions } from "firebase/functions";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy singletons — only initialise on the client (browser) side.
// During Next.js server-side pre-rendering these return stub objects that
// are never actually called (all consumers are "use client" components).
let _app: FirebaseApp, _auth: Auth, _db: Firestore, _storage: FirebaseStorage, _fns: Functions;

function getApp(): FirebaseApp {
  if (!_app) {
    const fresh = getApps().length === 0;
    _app = fresh ? initializeApp(cfg) : getApps()[0];
    if (fresh && process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
      _auth = getAuth(_app);
      _db = getFirestore(_app);
      _fns = getFunctions(_app, "asia-south1");
      connectAuthEmulator(_auth, "http://127.0.0.1:9099", { disableWarnings: true });
      connectFirestoreEmulator(_db, "127.0.0.1", 8080);
      connectFunctionsEmulator(_fns, "127.0.0.1", 5001);
    }
  }
  return _app;
}

export const app = typeof window !== "undefined" ? getApp() : ({} as FirebaseApp);
export const auth: Auth = typeof window !== "undefined" ? (_auth ?? getAuth(getApp())) : ({} as Auth);
export const db: Firestore = typeof window !== "undefined" ? (_db ?? getFirestore(getApp())) : ({} as Firestore);
export const storage: FirebaseStorage = typeof window !== "undefined" ? (_storage ?? getStorage(getApp())) : ({} as FirebaseStorage);
export const fns: Functions = typeof window !== "undefined" ? (_fns ?? getFunctions(getApp(), "asia-south1")) : ({} as Functions);
