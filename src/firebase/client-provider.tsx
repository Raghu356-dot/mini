
'use client';
import { FirebaseProvider } from '@/firebase/provider';
import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function will now only run on the client, after the component mounts.
    const instances = initializeFirebase();
    setFirebaseInstances(instances);
    setLoading(false);
  }, []); // The empty dependency array ensures this effect runs only once on the client.

  if (loading) {
    // Render a loading indicator while Firebase is initializing.
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!firebaseInstances) {
    // This case should ideally not be hit if initialization is successful
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Error initializing Firebase.</p>
      </div>
    );
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
