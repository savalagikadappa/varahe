import { Card } from '../common/Card.jsx';
import { LoadingState } from '../common/LoadingState.jsx';
import { ErrorState } from '../common/ErrorState.jsx';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const MarginDistributionChart = ({ query }) => {
  if (query.isLoading) {
    return (
      <Card title="Margin of victory distribution">
        <LoadingState />
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Card title="Margin of victory distribution">
        <ErrorState onRetry={query.refetch} />
      </Card>
    );
  }

  return (
    <Card title="Margin of victory distribution" subtitle="Buckets highlight nail-biters vs blowouts">
      <ResponsiveContainer width="100%" height={320} minWidth={0}>
        <BarChart data={(query.data || []).map((bucket) => ({ ...bucket, races: Number(bucket.races) }))}>
          <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `${value} races`} />
          <Bar dataKey="races" fill="#F97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
