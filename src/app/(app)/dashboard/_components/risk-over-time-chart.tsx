
'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {ChartContainer, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {mockThreats} from '@/lib/data';
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from 'recharts';
import type {ChartConfig} from '@/components/ui/chart';
import {useMemo} from 'react';

const chartConfig = {
  riskScore: {
    label: 'Risk Score',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export function RiskOverTimeChart() {
  const chartData = useMemo(() => {
    return mockThreats
      .map(threat => ({
        date: new Date(threat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
        riskScore: threat.riskScore,
      }))
      .reverse();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Score Over Time</CardTitle>
        <CardDescription>Average risk score of threats detected in the last hour.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={chartData} margin={{left: -20, right: 10, top: 10, bottom: 0}}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={value => value} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-riskScore)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-riskScore)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="riskScore"
              type="natural"
              fill="url(#fillRisk)"
              stroke="var(--color-riskScore)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

    