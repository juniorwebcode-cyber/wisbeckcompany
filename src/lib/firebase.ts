import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, updateDoc, getDocFromServer } from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';
import { Order, Product } from '../types';

// Autoconfigured Firebase keys (loaded from firebase-applet-config.json or .env)
export const activeFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || 'AIzaSyD2sGc07mj9y1ZGT3WemR18vfRGoojcCpA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || 'gen-lang-client-0267734261.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || 'gen-lang-client-0267734261',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || 'gen-lang-client-0267734261.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || '252399756242',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || '1:252399756242:web:81bc60c56334d008509e0b',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId || 'ai-studio-wisbeckcompanyso-d2b9fad0-1e6f-492b-9f4c-2244c176f3e3',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseAppletConfig.measurementId || '',
};

export const isFirebaseConfigured = true;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  if (getApps().length === 0) {
    app = initializeApp(activeFirebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  // Pass explicit database ID for Google Cloud Firestore instance
  db = activeFirebaseConfig.firestoreDatabaseId 
    ? getFirestore(app, activeFirebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization note:', error);
}

export { app, auth, db };

// Connection verification
async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase offline mode:', error.message);
    }
  }
}
testConnection();

// Save an order to Firestore
export async function syncOrderToFirebase(order: Order): Promise<boolean> {
  if (!db) {
    console.log('[Firebase] Pedido salvo localmente:', order.code);
    return true;
  }
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, order);
    console.log('[Firebase Firestore] Pedido sincronizado com sucesso:', order.code);
    return true;
  } catch (error) {
    console.warn('Sincronização em segundo plano no Firestore (armazenado localmente):', error);
    return false;
  }
}

// Update order status in Firestore
export async function updateOrderStatusInFirebase(
  orderId: string,
  status: Order['status'],
  trackingCode?: string
): Promise<boolean> {
  if (!db) return true;
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      ...(trackingCode ? { trackingCode } : {}),
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.warn('Atualização de status Firestore:', error);
    return false;
  }
}

// Save or update product in Firestore
export async function syncProductToFirebase(product: Product): Promise<boolean> {
  if (!db) return true;
  try {
    const prodRef = doc(db, 'products', product.id);
    await setDoc(prodRef, product);
    return true;
  } catch (error) {
    console.warn('Sincronização de produto Firestore:', error);
    return false;
  }
}
