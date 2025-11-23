import {MethodologyDiagram} from './_components/methodology-diagram';

export default function MethodologyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Methodology</h1>
        <p className="text-muted-foreground mt-2">
          A visual representation of how data flows through the AI agent system.
        </p>
      </div>
      <MethodologyDiagram />
    </div>
  );
}
