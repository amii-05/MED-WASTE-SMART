/**
 * Firebase service layer (stub / initialization).
 *
 * The application ships with a complete localStorage-backed mock so the
 * hackathon demo runs with zero configuration. To switch to Firebase:
 *
 *   1. Set USE_MOCK_DATA=false in .env (see .env.example)
 *   2. Provide VITE_FIREBASE_* credentials
 *   3. Uncomment the initialization below
 *
 * The service modules (authService, binService, etc.) check USE_MOCK_DATA
 * and either hit Firestore or the local dataStore, exposing the same
 * interface either way.
 */

export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== "false";

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;

// The Firebase SDK is an OPTIONAL dependency only used when real Firebase is
// enabled (USE_MOCK_DATA=false). We pass the module name through a runtime
// helper so Vite does not try to statically resolve these bare specifiers at
// build time or during `vite serve` (they are not installed in the mock demo).
const dynImport = (specifier) => import(specifier);

// Example only — not called unless USE_MOCK_DATA is false.
export const initFirebase = () => {
  if (!USE_MOCK_DATA) {
    // Dynamic import keeps the bundle small for the mock-only demo.
    return dynImport("firebase/app").then(({ initializeApp }) => {
      return dynImport("firebase/auth").then(({ getAuth }) => {
        return dynImport("firebase/firestore").then(({ getFirestore }) => {
          const config = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID,
          };
          firebaseApp = initializeApp(config);
          firebaseAuth = getAuth(firebaseApp);
          firebaseDb = getFirestore(firebaseApp);
          return { firebaseApp, firebaseAuth, firebaseDb };
        });
      });
    });
  }
  return Promise.resolve({ firebaseApp: null, firebaseAuth: null, firebaseDb: null });
};

export const getFirebase = () => ({ firebaseApp, firebaseAuth, firebaseDb });
