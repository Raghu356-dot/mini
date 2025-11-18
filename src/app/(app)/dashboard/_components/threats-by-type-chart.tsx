'use client';

import {useMemo} from 'react';
import {Pie, PieChart, Cell} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {mockThreats} from '@/lib/data';
import type {ChartConfig} from '@/components/ui/chart';
import type {ThreatEvent} from '@/lib/types';

const chartConfig = {
  Phishing: {label: 'Phishing', color: 'hsl(var(--chart-1))'},
  Malware: {label: 'Malware', color: 'hsl(var(--chart-5))'},
  Intrusion: {label: 'Intrusion', color: 'hsl(var(--chart-2))'},
  Fraud: {label: 'Fraud', color: 'hsl(var(--chart-4))'},
} satisfies ChartConfig;

export function ThreatsByTypeChart() {
  const chartData = useMemo(() => {
    const counts = mockThreats.reduce(
      (acc, threat) => {
        acc[threat.threatType] = (acc[threat.threatType] || 0) + 1;
        return acc;
      },
      {} as Record<ThreatEvent['threatType'], number>
    );

    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      fill: `var(--color-${type})`,
    }));
  }, []);

  const totalThreats = useMemo(() => chartData.reduce((acc, curr) => acc + curr.count, 0), [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threats by Type</CardTitle>
        <CardDescription>Distribution of all detected threats.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="type" hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="type" innerRadius={60} strokeWidth={5}>
              {chartData.map(entry => (
                <Cell key={`cell-${entry.type}`} fill={chartConfig[entry.type as keyof typeof chartConfig].color} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-3xl font-bold">
              {totalThreats}
            </text>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
