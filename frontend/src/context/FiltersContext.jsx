import { useMemo, useState } from 'react';
import { DEFAULT_FILTERS } from './defaultFilters.js';
import { FilterContext } from './filterContext.js';

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const updateFilters = (updates) => {
    setFilters((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const value = useMemo(
    () => ({
      filters,
      updateFilters,
      resetFilters
    }),
    [filters]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};
