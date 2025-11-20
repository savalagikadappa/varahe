import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IndiaMap } from './IndiaMap.jsx';
import { Card } from '../common/Card';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';

export const TurnoutChart = ({ query }) => {
  const { data, isLoading, isError, refetch } = query;

  const normalizedData = useMemo(() => {
    if (!data) return [];

    const toTurnoutNumber = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    return data
      .map((entry) => {
        const turnoutValue =
          toTurnoutNumber(entry.turnout) ??
          toTurnoutNumber(entry.avg_turnout) ??
          toTurnoutNumber(entry.turnout_percentage) ??
          toTurnoutNumber(entry.turnoutPercent) ??
          toTurnoutNumber(entry.turnoutPercentage);

        const stateName =
          entry.state ||
          entry.State_Name ||
          entry.state_name ||
          entry.STATE_NAME ||
          entry.stateName;

        if (!stateName || turnoutValue === null) {
          return null;
        }

        return {
          state: stateName,
          turnout: turnoutValue
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.turnout - a.turnout);
  }, [data]);

  if (isLoading) {
    return (
      <Card title="State-wise Turnout">
        <LoadingState />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card title="State-wise Turnout">
        <ErrorState onRetry={refetch} />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <IndiaMap query={query} dataOverride={normalizedData} />

      <Card title="State-wise Turnout (Bar Chart)" subtitle="Comparison of voter turnout across states">
        <ResponsiveContainer width="100%" height={500} minWidth={0}>
          <BarChart
            data={normalizedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="state"
              width={150}
              tick={{ fontSize: 10 }}
              interval={0}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Turnout']}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '4px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Bar dataKey="turnout" fill="#8884d8" name="Turnout %" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
