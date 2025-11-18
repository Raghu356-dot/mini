'use client';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseProvider } from '@/firebase/provider';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children: ReactNode;
};

export function FirebaseClientProvider({
  firebaseApp,
  auth,
  firestore,
  children,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
