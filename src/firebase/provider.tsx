
'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  configError: string | null;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

type FirebaseProviderProps = {
  children: ReactNode;
} & FirebaseContextValue;

export function FirebaseProvider({
  children,
  firebaseApp,
  auth,
  firestore,
  configError,
}: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={{ firebaseApp, auth, firestore, configError }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  const context = useFirebase();
  if (!context.firebaseApp && !context.configError) {
    throw new Error("Firebase App is not available.");
  }
  return context.firebaseApp;
}

export function useFirestore() {
  const context = useFirebase();
  if (!context.firestore && !context.configError) {
    throw new Error("Firestore is not available.");
  }
  return context.firestore;
}

export function useAuth() {
  const context = useFirebase();
  if (!context.auth && !context.configError) {
    throw new Error("Firebase Auth is not available.");
  }
  return context.auth;
}

export function useFirebaseConfigError() {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
      throw new Error('useFirebaseConfigError must be used within a FirebaseProvider');
    }
    return context.configError;
}
