
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
    // This function will now only run on the client, after the component mounts.
    const instances = initializeFirebase();
    setFirebaseInstances(instances);
  }, []); // The empty dependency array ensures this effect runs only once on the client.

  if (!firebaseInstances) {
    // Render nothing or a loading indicator while Firebase is initializing.
    // This prevents children from trying to access Firebase before it's ready.
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
