import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '../common/Card.jsx';
import { LoadingState } from '../common/LoadingState.jsx';
import { ErrorState } from '../common/ErrorState.jsx';
import { partyPalette } from '../../utils/formatters.js';

const colors = (index) => partyPalette[index % partyPalette.length];

export const PartySeatShareChart = ({ query }) => {
  const chartData = useMemo(() => {
    if (!query.data) return [];
    const byYear = new Map();
    const parties = new Set();

    query.data.forEach((entry) => {
      const year = Number(entry.year ?? entry.Year);
      const party = entry.party || entry.Party;
      const seats = Number(entry.seats_won || entry.seats || 0);
      parties.add(party);
      if (!byYear.has(year)) {
        byYear.set(year, { year });
      }
      byYear.get(year)[party] = seats;
    });

    return {
      parties: Array.from(parties),
      rows: Array.from(byYear.values()).sort((a, b) => a.year - b.year)
    };
  }, [query.data]);

  if (query.isLoading) {
    return (
      <Card title="Party seat share by year" subtitle="Number of seats won per party">
        <LoadingState />
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Card title="Party seat share by year">
        <ErrorState onRetry={query.refetch} />
      </Card>
    );
  }

  if (!chartData.rows.length) {
    return (
      <Card title="Party seat share by year">
        <p>No data for the selected filters.</p>
      </Card>
    );
  }

  return (
    <Card
      title="Party seat share by year"
      subtitle="Stacked bars showcase how parliamentary seats shift between parties."
    >
      <ResponsiveContainer width="100%" height={320} minWidth={0}>
        <BarChart data={chartData.rows} stackOffset="expand">
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis hide />
          <Tooltip formatter={(value, name) => [`${value} seats`, name]} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {chartData.parties.map((party, index) => (
            <Bar key={party} dataKey={party} stackId="a" fill={colors(index)} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
