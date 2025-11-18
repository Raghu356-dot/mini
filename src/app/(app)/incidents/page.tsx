
'use client';

import { IncidentResponseFeed } from './_components/incident-response-feed';
import { initializeFirebase, FirebaseClientProvider } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function IncidentsPage() {
  const [firebaseInstances, setFirebaseInstances] = useState<{
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);

  useEffect(() => {
    // Initialize Firebase only on the client side
    setFirebaseInstances(initializeFirebase());
  }, []);

  if (!firebaseInstances) {
    // You can return a loader here if you want
    return null; 
  }

  const { firebaseApp, firestore, auth } = firebaseInstances;

  return (
    <FirebaseClientProvider firebaseApp={firebaseApp} auth={auth} firestore={firestore}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automated Incident Response</h1>
          <p className="text-muted-foreground mt-2">
            A real-time feed of simulated actions taken by the automated incident response agent.
          </p>
        </div>
        <IncidentResponseFeed />
      </div>
    </FirebaseClientProvider>
  );
}
