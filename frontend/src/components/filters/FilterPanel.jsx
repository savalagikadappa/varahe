import { useMemo } from 'react';
import Select from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { useFilters } from '../../context/useFilters.js';
import { electionApi } from '../../services/apiClient.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import {
  COMMON_PARTIES,
  GENDER_OPTIONS,
  INDIAN_STATES,
  YEAR_MAX,
  YEAR_MIN
} from '../../utils/constants.js';
import styles from './FilterPanel.module.css';

const selectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'var(--surface-muted)',
    borderColor: 'transparent',
    borderRadius: '999px',
    padding: '0 0.25rem'
  }),
  multiValue: (base) => ({
    ...base,
    borderRadius: '999px'
  })
};

export const FilterPanel = () => {
  const { filters, updateFilters, resetFilters } = useFilters();
  const debouncedConstituency = useDebouncedValue(filters.constituency, 400);

  const hintQuery = useQuery({
    queryKey: ['constituency-hints', debouncedConstituency],
    queryFn: () => electionApi.getConstituencyHints(debouncedConstituency),
    enabled: debouncedConstituency.length >= 3
  });

  const handleYearChange = (start, end) => {
    if (start > end) return;
    updateFilters({ yearRange: { start, end } });
  };

  const stateOptions = useMemo(
    () => INDIAN_STATES.map((state) => ({ label: state, value: state })),
    []
  );

  const partyOptions = useMemo(
    () => COMMON_PARTIES.map((party) => ({ label: party, value: party })),
    []
  );

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h1>Indian General Election Insights</h1>
          <p>Filter the data across three decades to uncover trends and stories.</p>
        </div>
        <button type="button" className={styles.resetButton} onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.yearBlock}>
          <div className={styles.labelRow}>
            <span>Year range</span>
            <strong>
              {filters.yearRange.start} – {filters.yearRange.end}
            </strong>
          </div>
          <div className={styles.rangeInputs}>
            <input
              type="range"
              min={YEAR_MIN}
              max={YEAR_MAX}
              value={filters.yearRange.start}
              onChange={(event) => handleYearChange(Number(event.target.value), filters.yearRange.end)}
            />
            <input
              type="range"
              min={YEAR_MIN}
              max={YEAR_MAX}
              value={filters.yearRange.end}
              onChange={(event) => handleYearChange(filters.yearRange.start, Number(event.target.value))}
            />
          </div>
          <div className={styles.rangeNumbers}>
            <input
              type="number"
              min={YEAR_MIN}
              max={filters.yearRange.end}
              value={filters.yearRange.start}
              onChange={(event) => handleYearChange(Number(event.target.value), filters.yearRange.end)}
            />
            <span>to</span>
            <input
              type="number"
              min={filters.yearRange.start}
              max={YEAR_MAX}
              value={filters.yearRange.end}
              onChange={(event) => handleYearChange(filters.yearRange.start, Number(event.target.value))}
            />
          </div>
        </div>

        <div>
          <label>State(s)</label>
          <Select
            isMulti
            classNamePrefix="select"
            styles={selectStyles}
            value={filters.states.map((state) => ({ value: state, label: state }))}
            onChange={(selected) => updateFilters({ states: selected.map((option) => option.value) })}
            options={stateOptions}
            placeholder="All states"
          />
        </div>

        <div>
          <label>Party</label>
          <Select
            isMulti
            classNamePrefix="select"
            styles={selectStyles}
            value={filters.parties.map((party) => ({ value: party, label: party }))}
            onChange={(selected) => updateFilters({ parties: selected.map((option) => option.value) })}
            options={partyOptions}
            placeholder="All parties"
          />
        </div>

        <div className={styles.genderGroup}>
          <label>Gender</label>
          <div className={styles.genderOptions}>
            {GENDER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={option.value === filters.sex ? styles.genderActive : styles.genderChip}
                onClick={() => updateFilters({ sex: option.value })}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="constituency-input">Constituency</label>
          <input
            id="constituency-input"
            className={styles.textInput}
            type="text"
            value={filters.constituency}
            placeholder="Search by constituency"
            onChange={(event) => {
              updateFilters({ constituency: event.target.value });
            }}
          />
          {debouncedConstituency.length >= 3 && hintQuery.isSuccess && hintQuery.data.length > 0 && (
            <ul className={styles.suggestionList}>
              {hintQuery.data.map((hint) => (
                <li key={hint}>
                  <button
                    type="button"
                    onClick={() => {
                      updateFilters({ constituency: hint });
                    }}
                  >
                    {hint}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.toggleRow}>
          <span>Winners only</span>
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={filters.winnersOnly}
            onClick={() => updateFilters({ winnersOnly: !filters.winnersOnly })}
          >
            <span className={filters.winnersOnly ? styles.toggleThumbOn : styles.toggleThumb} />
          </button>
        </div>
      </div>
    </section>
  );
};
