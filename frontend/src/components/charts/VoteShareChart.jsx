import { Card } from '../common/Card.jsx';
import { LoadingState } from '../common/LoadingState.jsx';
import { ErrorState } from '../common/ErrorState.jsx';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { partyPalette } from '../../utils/formatters.js';

export const VoteShareChart = ({ query }) => {
  if (query.isLoading) {
    return (
      <Card title="Top parties by vote share">
        <LoadingState />
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Card title="Top parties by vote share">
        <ErrorState onRetry={query.refetch} />
      </Card>
    );
  }

  return (
    <Card
      title="Top parties by vote share"
      subtitle="Based on filtered constituencies (sampled up to 500 races)."
    >
      <ResponsiveContainer width="100%" height={320} minWidth={0}>
        <PieChart>
          <Pie data={query.data || []} dataKey="voteShare" nameKey="party" innerRadius={70} outerRadius={120}>
            {(query.data || []).map((entry, index) => (
              <Cell key={entry.party} fill={partyPalette[index % partyPalette.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value}%`, name]} />
        </PieChart>
      </ResponsiveContainer>
      <ul className={"legend"}>
        {(query.data || []).map((entry, index) => (
          <li key={entry.party}>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: partyPalette[index % partyPalette.length],
                marginRight: 8
              }}
            />
            {entry.party} — {entry.voteShare}% votes ({entry.seats} seats)
          </li>
        ))}
      </ul>
    </Card>
  );
};
