
import {AnalysisClient} from './_components/analysis-client';

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Threat Analysis Agents</h1>
        <p className="text-muted-foreground mt-2">
          Submit data to individual AI agents for analysis. In a real system, this data would be
          streamed automatically from various sources.
        </p>
      </div>
      <AnalysisClient />
    </div>
  );
}

    