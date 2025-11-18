import {DashboardStats} from './_components/dashboard-stats';
import {RecentThreatsTable} from './_components/recent-threats-table';
import {RiskOverTimeChart} from './_components/risk-over-time-chart';
import {ThreatsByTypeChart} from './_components/threats-by-type-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardStats />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RiskOverTimeChart />
        </div>
        <div className="lg:col-span-2">
          <ThreatsByTypeChart />
        </div>
      </div>
      <RecentThreatsTable />
    </div>
  );
}
