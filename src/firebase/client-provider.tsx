
'use client';
import { FirebaseProvider } from '@/firebase/provider';
import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { UserProvider } from './auth/use-user';
import { firebaseConfig } from './config';

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
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseConfig.apiKey) {
      setConfigError("Your Firebase configuration is missing or incomplete. Please check your `.env` file and ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly.");
      setLoading(false);
      return;
    }

    try {
      const instances = initializeFirebase();
      setFirebaseInstances(instances);
    } catch (e: any)      {
      console.error(e);
      setConfigError(`An error occurred during Firebase initialization: ${e.message}`);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const authInstance = firebaseInstances ? firebaseInstances.auth : null;
  const firestoreInstance = firebaseInstances ? firebaseInstances.firestore : null;
  const appInstance = firebaseInstances ? firebaseInstances.firebaseApp : null;

  return (
    <FirebaseProvider
      firebaseApp={appInstance as any}
      auth={authInstance as any}
      firestore={firestoreInstance as any}
      configError={configError}
    >
      <UserProvider>
        {children}
      </UserProvider>
    </FirebaseProvider>
  );
}
