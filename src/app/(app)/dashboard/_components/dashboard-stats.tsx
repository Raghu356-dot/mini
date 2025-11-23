
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {AlertTriangle, CheckCircle2, Bot, ShieldAlert} from 'lucide-react';
import {mockThreats} from '@/lib/data';

export function DashboardStats() {
  const totalAlerts = mockThreats.length;
  const highRiskAlerts = mockThreats.filter(t => t.riskScore > 80).length;
  const mitigatedThreats = mockThreats.filter(t => t.status === 'Mitigated').length;
  const resolvedIncidents = mockThreats.filter(t => t.status === 'Resolved').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAlerts}</div>
          <p className="text-xs text-muted-foreground">+5 since last hour</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High-Risk Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highRiskAlerts}</div>
          <p className="text-xs text-muted-foreground">Critical threats needing attention</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Automated Mitigations</CardTitle>
          <ShieldAlert className="h-4 w-4 text-electric" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mitigatedThreats}</div>
          <p className="text-xs text-muted-foreground">Actions taken automatically</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved Incidents</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolvedIncidents}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>
    </div>
  );
}

    