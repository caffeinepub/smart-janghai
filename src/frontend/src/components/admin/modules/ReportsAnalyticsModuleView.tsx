import ReportsDashboard from '../reports/ReportsDashboard';

export default function ReportsAnalyticsModuleView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">View statistics and export data</p>
      </div>

      <ReportsDashboard />
    </div>
  );
}
