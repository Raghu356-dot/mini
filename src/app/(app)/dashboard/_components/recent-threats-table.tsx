
'use client';

import {useState, useEffect} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';
import {mockThreats} from '@/lib/data';
import type {ThreatEvent} from '@/lib/types';
import {MoreHorizontal} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {formatDistanceToNow} from 'date-fns';
import {cn} from '@/lib/utils';

const getBadgeClass = (status: ThreatEvent['status']): string => {
  switch (status) {
    case 'Detected':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30';
    case 'Investigating':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30';
    case 'Mitigated':
      return 'bg-green-500/20 text-electric border-green-500/30 hover:bg-green-500/30';
    case 'Resolved':
      return 'bg-primary/20 text-primary-foreground/80 border-primary/30 hover:bg-primary/30';
    default:
      return '';
  }
};

const getRiskColor = (score: number) => {
  if (score > 80) return 'text-destructive';
  if (score > 60) return 'text-yellow-500';
  return 'text-electric';
};

export function RecentThreatsTable() {
  const [threats, setThreats] = useState<ThreatEvent[]>(mockThreats);

  useEffect(() => {
    const interval = setInterval(() => {
      const newThreat: ThreatEvent = {
        id: `threat-${Date.now()}`,
        timestamp: new Date().toISOString(),
        threatType: ['Phishing', 'Intrusion', 'Malware', 'Fraud'][
          Math.floor(Math.random() * 4)
        ] as ThreatEvent['threatType'],
        source: `10.0.1.${Math.floor(Math.random() * 255)}`,
        riskScore: Math.floor(Math.random() * 50 + 50),
        details: 'New automated event detected.',
        status: 'Detected',
        agent: ['Network Anomaly', 'Phishing & Malware'][Math.floor(Math.random() * 2)] as any,
      };
      setThreats(prev => [newThreat, ...prev.slice(0, 19)]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Event Bus</CardTitle>
        <CardDescription>Real-time feed of detected threats from all agents.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Risk</TableHead>
                <TableHead>Threat Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="hidden md:table-cell">Agent</TableHead>
                <TableHead className="hidden lg:table-cell">Detected</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threats.map(threat => (
                <TableRow
                  key={threat.id}
                  className="transition-all hover:bg-muted/50"
                >
                  <TableCell>
                    <div className={`font-bold ${getRiskColor(threat.riskScore)}`}>
                      {threat.riskScore}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{threat.threatType}</TableCell>
                  <TableCell className="font-mono text-xs">{threat.source}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {threat.agent}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">
                    {formatDistanceToNow(new Date(threat.timestamp), {addSuffix: true})}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('font-semibold', getBadgeClass(threat.status))}>
                      {threat.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Isolate Device</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

    