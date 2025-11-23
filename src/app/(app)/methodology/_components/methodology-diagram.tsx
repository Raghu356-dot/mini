'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  Mail,
  Link2,
  File,
  Network,
  Users,
  GitMerge,
  ArrowRight,
  Database,
  ShieldCheck,
} from 'lucide-react';

const DiagramCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="text-center flex flex-col">
    <CardHeader className="flex-shrink-0">
      <div className="flex justify-center items-center gap-2">
        {icon}
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground flex-grow">{children}</CardContent>
  </Card>
);

const Arrow = () => (
  <div className="flex items-center justify-center my-4 md:my-0">
    <ArrowRight className="h-8 w-8 text-muted-foreground md:rotate-90 lg:rotate-0" />
  </div>
);

export function MethodologyDiagram() {
  return (
    <div className="space-y-8">
      {/* Step 1: Input Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Data Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <DiagramCard icon={<Mail className="h-6 w-6" />} title="Email">
              Email body content is submitted for phishing and threat analysis.
            </DiagramCard>
            <DiagramCard icon={<Link2 className="h-6 w-6" />} title="URL">
              Web links are scanned for malicious content or destinations.
            </DiagramCard>
            <DiagramCard icon={<File className="h-6 w-6" />} title="File">
              File contents are analyzed for potential malware signatures.
            </DiagramCard>
            <DiagramCard icon={<Network className="h-6 w-6" />} title="Network Logs">
              Log data is summarized to detect network anomalies or intrusions.
            </DiagramCard>
            <DiagramCard icon={<Users className="h-6 w-6" />} title="User Activity">
              Activity descriptions are analyzed to detect fraudulent behavior.
            </DiagramCard>
          </div>
        </CardContent>
      </Card>

      <Arrow />

      {/* Step 2: AI Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Step 2: AI Agent Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <DiagramCard icon={<ShieldCheck className="h-6 w-6 text-primary" />} title="Specialized AI Agents">
              Each piece of input data is sent to a dedicated Genkit AI flow. These flows are powered
              by a generative model with a prompt engineered for its specific cybersecurity task, such as
              email analysis, URL scanning, or fraud detection. The agent returns a structured
              analysis and verdict.
            </DiagramCard>
          </div>
        </CardContent>
      </Card>

      <Arrow />

      {/* Step 3: Event Logging */}
      <Card>
        <CardHeader>
          <CardTitle>Step 3: Event Logging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <DiagramCard
              icon={<Database className="h-6 w-6 text-primary" />}
              title="Persistent Event Log"
            >
              The output from each agent analysis is captured and stored as a structured event. This
              log, visible on the 'History' page, creates a persistent record of all detected
              threats and analyses performed by the system.
            </DiagramCard>
          </div>
        </CardContent>
      </Card>

      <Arrow />

      {/* Step 4: Correlation */}
      <Card>
        <CardHeader>
          <CardTitle>Step 4: Event Correlation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <DiagramCard
              icon={<GitMerge className="h-6 w-6 text-primary" />}
              title="Correlation Agent"
            >
              The user can select multiple, seemingly disparate events from the log and submit them
              to the Correlation Agent. This agent analyzes the selected events to identify
              potential connections, patterns, or signs of a coordinated, multi-stage attack.
            </DiagramCard>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
