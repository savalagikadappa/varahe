import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../common/Card.jsx';
import { LoadingState } from '../common/LoadingState.jsx';
import { ErrorState } from '../common/ErrorState.jsx';
import { electionApi } from '../../services/apiClient.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import { formatNumber } from '../../utils/formatters.js';
import styles from './CandidateSearch.module.css';

export const CandidateSearch = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 400);

  const searchQuery = useQuery({
    queryKey: ['candidate-search', debouncedQuery],
    queryFn: () => electionApi.searchCandidates(debouncedQuery),
    enabled: debouncedQuery.length >= 3
  });

  return (
    <Card title="Candidate search" subtitle="Look up leaders and explore their electoral journeys.">
      <div className={styles.searchBar}>
        <input
          type="search"
          placeholder="Search by candidate name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p>{debouncedQuery.length < 3 ? 'Type at least 3 characters' : ''}</p>
      </div>

      {searchQuery.isLoading && <LoadingState message="Searching candidates…" />}
      {searchQuery.isError && <ErrorState onRetry={searchQuery.refetch} />}

      {searchQuery.isSuccess && searchQuery.data.length === 0 && (
        <p className={styles.emptyState}>No candidates match that query yet.</p>
      )}

      {searchQuery.isSuccess && searchQuery.data.length > 0 && (
        <div className={styles.resultsGrid}>
          {searchQuery.data.slice(0, 6).map((candidate) => (
            <article key={candidate.candidate} className={styles.card}>
              <header>
                <h3>{candidate.candidate}</h3>
                <span>{candidate.history.length} races</span>
              </header>
              <ul>
                {candidate.history.map((race) => (
                  <li key={`${race.year}-${race.constituency}`}>
                    <strong>{race.year}</strong> — {race.constituency}, {race.state}
                    <br />
                    {race.party} · Votes: {formatNumber(race.votes)} · {race.is_winner ? 'Winner' : `Pos ${race.position || '—'}`}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </Card>
  );
};
