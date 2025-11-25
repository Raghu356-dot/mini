
'use client';
import { FirebaseProvider } from '@/firebase/provider';
import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

type Props = {
  children: ReactNode;
};

interface FirebaseInstances {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({ children }: Props) {
  const [firebaseInstances, setFirebaseInstances] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // This function will now only run on the client
    const instances = initializeFirebase();
    setFirebaseInstances(instances);
  }, []);

  if (!firebaseInstances) {
    // You can return a loader here if you want
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseInstances.firebaseApp}
      auth={firebaseInstances.auth}
      firestore={firebaseInstances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
