import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../common/Card.jsx';
import { LoadingState } from '../common/LoadingState.jsx';
import { ErrorState } from '../common/ErrorState.jsx';
import { PaginationControls } from '../common/PaginationControls.jsx';
import { useFilters } from '../../context/useFilters.js';
import { electionApi } from '../../services/apiClient.js';
import { formatNumber } from '../../utils/formatters.js';
import styles from './ConstituencyResultsTable.module.css';

const columns = [
  { label: 'Year', key: 'Year' },
  { label: 'State', key: 'State_Name' },
  { label: 'Constituency', key: 'Constituency_Name' },
  { label: 'Candidate', key: 'Candidate' },
  { label: 'Party', key: 'Party' },
  { label: 'Votes', key: 'Votes' },
  { label: 'Vote share', key: 'Vote_Share_Percentage' },
  { label: 'Margin', key: 'Margin' },
  { label: 'Winner', key: 'Is_Winner' }
];

export const ConstituencyResultsTable = () => {
  const { filters } = useFilters();
  const filterKey = useMemo(
    () =>
      JSON.stringify({
        ...filters,
        yearRange: filters.yearRange,
        states: filters.states,
        parties: filters.parties
      }),
    [filters]
  );
  const [pageState, setPageState] = useState({ key: filterKey, value: 1 });
  const page = pageState.key === filterKey ? pageState.value : 1;
  const [limit, setLimit] = useState(50);
  const [sort, setSort] = useState({ key: 'Year', direction: 'desc' });

  const query = useQuery({
    queryKey: ['elections-table', filterKey, page, limit],
    queryFn: () => electionApi.getElections({ filters, page, limit }),
    keepPreviousData: true
  });

  const sortedRows = useMemo(() => {
    if (!query.data) return [];
    const rows = [...query.data.rows];
    rows.sort((a, b) => {
      const valueA = a[sort.key];
      const valueB = b[sort.key];
      if (valueA == null) return 1;
      if (valueB == null) return -1;
      if (valueA === valueB) return 0;
      if (sort.direction === 'asc') {
        return valueA < valueB ? -1 : 1;
      }
      return valueA > valueB ? -1 : 1;
    });
    return rows;
  }, [query.data, sort]);

  const totalPages = Math.max(1, Math.ceil((query.data?.total || 0) / limit));

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handlePageChange = (nextPage) => {
    setPageState({ key: filterKey, value: nextPage });
  };

  if (query.isLoading) {
    return (
      <Card title="Constituency level results">
        <LoadingState />
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Card title="Constituency level results">
        <ErrorState onRetry={query.refetch} />
      </Card>
    );
  }

  return (
    <Card title="Constituency level results" subtitle="Sortable, paginated table filtered above.">
      <div className={styles.toolbar}>
        <label>
          Rows per page
          <select value={limit} onChange={(event) => setLimit(Number(event.target.value))}>
            {[25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  <button type="button" onClick={() => toggleSort(column.key)}>
                    {column.label}
                    {sort.key === column.key && <span>{sort.direction === 'asc' ? '▲' : '▼'}</span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={`${row.Year}-${row.Constituency_No}-${row.Candidate}`}>
                <td>{row.Year}</td>
                <td>{row.State_Name}</td>
                <td>{row.Constituency_Name}</td>
                <td>{row.Candidate}</td>
                <td>{row.Party}</td>
                <td>{formatNumber(row.Votes)}</td>
                <td>{row.Vote_Share_Percentage?.toFixed(2) ?? '—'}%</td>
                <td>{formatNumber(row.Margin)}</td>
                <td>
                  <span className={row.Is_Winner ? styles.winnerBadge : styles.runnerBadge}>
                    {row.Is_Winner ? 'Winner' : row.Position ? `#${row.Position}` : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </Card>
  );
};
