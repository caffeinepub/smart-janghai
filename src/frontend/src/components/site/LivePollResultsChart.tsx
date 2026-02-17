import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  name: string;
  votes: number;
}

interface LivePollResultsChartProps {
  data: ChartData[];
}

export default function LivePollResultsChart({ data }: LivePollResultsChartProps) {
  // Memoize colors to prevent flicker
  const colors = useMemo(() => {
    return [
      'oklch(0.68 0.15 50)', // Saffron/orange
      'oklch(0.55 0.12 140)', // Green
      'oklch(0.65 0.10 30)', // Warm brown
      'oklch(0.60 0.08 60)', // Gold
      'oklch(0.50 0.10 160)', // Teal
    ];
  }, []);

  // Stable data reference
  const chartData = useMemo(() => data, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-poll-muted">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.005 240)" opacity={0.3} />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fill: 'oklch(0.5 0.02 240)', fontSize: 12 }}
          stroke="oklch(0.7 0.01 240)"
        />
        <YAxis
          tick={{ fill: 'oklch(0.5 0.02 240)', fontSize: 12 }}
          stroke="oklch(0.7 0.01 240)"
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'oklch(1 0 0)',
            border: '1px solid oklch(0.85 0.005 240)',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
          labelStyle={{ color: 'oklch(0.2 0.02 240)', fontWeight: 600 }}
          itemStyle={{ color: 'oklch(0.4 0.02 240)' }}
          cursor={{ fill: 'oklch(0.95 0.005 240)' }}
        />
        <Bar
          dataKey="votes"
          radius={[8, 8, 0, 0]}
          animationDuration={800}
          animationEasing="ease-out"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
