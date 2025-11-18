
'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { IncidentResponse } from '@/lib/types';
import { mockIncidentResponses } from '@/lib/data';


const getBadgeClass = (severity: IncidentResponse['severity']): string => {
  switch (severity) {
    case 'high':
      return 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30';
    case 'low':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30';
    default:
      return '';
  }
};

export function IncidentResponseFeed() {
  const [responses, setResponses] = useState<IncidentResponse[]>(mockIncidentResponses);

  // NOTE: In a real application, you would use a real-time listener to Firestore
  // to get the incident responses. For this demo, we'll use mock data.
  useEffect(() => {
    // This is where you would set up a Firestore listener
    // e.g. onSnapshot(collection(db, 'incident_responses'), ...)
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Log</CardTitle>
        <CardDescription>
          Simulated actions performed by the automated response agent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Threat Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead>Simulated Result</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No incident responses logged yet.
                  </TableCell>
                </TableRow>
              )}
              {responses.map((response) => (
                <TableRow key={response.id} className="transition-all hover:bg-muted/50">
                  <TableCell className="font-medium">{response.threatType}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('font-semibold capitalize', getBadgeClass(response.severity))}
                    >
                      {response.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{response.recommendedAction}</TableCell>
                  <TableCell className="text-muted-foreground">{response.simulatedResult}</TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {formatDistanceToNow(new Date(response.timestamp), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
