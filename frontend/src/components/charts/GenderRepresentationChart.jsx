import { Card } from '../common/Card.jsx';
import { LoadingState } from '../common/LoadingState.jsx';
import { ErrorState } from '../common/ErrorState.jsx';
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export const GenderRepresentationChart = ({ query }) => {
  if (query.isLoading) {
    return (
      <Card title="Gender representation">
        <LoadingState />
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Card title="Gender representation">
        <ErrorState onRetry={query.refetch} />
      </Card>
    );
  }

  const grouped = {};
  (query.data || []).forEach((row) => {
    if (!grouped[row.year]) {
      grouped[row.year] = { year: row.year };
    }
    grouped[row.year][row.sex] = Number(row.percentage);
  });

  const rows = Object.values(grouped).sort((a, b) => a.year - b.year);

  return (
    <Card title="Gender representation" subtitle="% of candidates across genders">
      <ResponsiveContainer width="100%" height={320} minWidth={0}>
        <LineChart data={rows} margin={{ left: 20, right: 20 }}>
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Line type="monotone" dataKey="MALE" name="Male" stroke="#6366F1" strokeWidth={4} dot={false} />
          <Line type="monotone" dataKey="FEMALE" name="Female" stroke="#EC4899" strokeWidth={8} dot={false} />
          <Line type="monotone" dataKey="O" name="Other" stroke="#10B981" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="UNKNOWN" name="Unknown" stroke="#94A3B8" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
