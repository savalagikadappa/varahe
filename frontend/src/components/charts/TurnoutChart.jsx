import { Card } from '../common/Card.jsx';
import { LoadingState } from '../common/LoadingState.jsx';
import { ErrorState } from '../common/ErrorState.jsx';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export const TurnoutChart = ({ query }) => {
  if (query.isLoading) {
    return (
      <Card title="State-wise voter turnout">
        <LoadingState />
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Card title="State-wise voter turnout">
        <ErrorState onRetry={query.refetch} />
      </Card>
    );
  }

  const data = (query.data || [])
    .map((entry) => ({
      state: entry.state,
      turnout: Number(entry.avg_turnout || 0)
    }))
    .sort((a, b) => b.turnout - a.turnout);

  return (
    <Card
      title="State-wise voter turnout"
      subtitle="Average percentage turnout across selected elections"
    >
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
          <XAxis type="number" unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
          <YAxis dataKey="state" type="category" width={120} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="turnout" fill="#0EA5E9" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
