import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { electionApi } from '../services/apiClient.js';
import { useFilters } from '../context/useFilters.js';

const buildFilterKey = (filters) =>
  JSON.stringify({
    yearRange: filters.yearRange,
    states: filters.states,
    parties: filters.parties,
    sex: filters.sex,
    constituency: filters.constituency,
    winnersOnly: filters.winnersOnly
  });

export const useDashboardData = () => {
  const { filters } = useFilters();
  const yearKey = `${filters.yearRange.start}-${filters.yearRange.end}`;
  const filterKey = useMemo(() => buildFilterKey(filters), [filters]);

  const seatShareQuery = useQuery({
    queryKey: ['seat-share', yearKey],
    queryFn: () => electionApi.getPartySeatShare(filters),
    placeholderData: []
  });

  const turnoutQuery = useQuery({
    queryKey: ['turnout', yearKey],
    queryFn: () => electionApi.getTurnoutByState(filters),
    placeholderData: []
  });

  const genderQuery = useQuery({
    queryKey: ['gender', yearKey],
    queryFn: () => electionApi.getGenderRepresentation(filters),
    placeholderData: []
  });

  const marginQuery = useQuery({
    queryKey: ['margin-distribution', yearKey],
    queryFn: () => electionApi.getMarginDistribution(filters),
    placeholderData: []
  });

  const voteShareQuery = useQuery({
    queryKey: ['vote-share', filterKey],
    queryFn: () => electionApi.getVoteShare(filters),
    placeholderData: []
  });

  return {
    seatShareQuery,
    turnoutQuery,
    genderQuery,
    marginQuery,
    voteShareQuery
  };
};
