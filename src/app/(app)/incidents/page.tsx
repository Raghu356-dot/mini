
import { IncidentResponseFeed } from './_components/incident-response-feed';
import { initializeFirebase, FirebaseClientProvider } from '@/firebase';

const { firebaseApp, firestore, auth } = initializeFirebase();

export default function IncidentsPage() {
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
