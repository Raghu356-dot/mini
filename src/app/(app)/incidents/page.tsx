
import { IncidentResponseFeed } from './_components/incident-response-feed';

export default function IncidentsPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Automated Incident Response</h1>
        <p className="text-muted-foreground mt-2">
          A real-time feed of simulated actions taken by the automated incident response agent.
        </p>
      </div>
      <IncidentResponseFeed />
    </div>
  );
}
