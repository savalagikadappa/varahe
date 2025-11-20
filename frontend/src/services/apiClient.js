import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 15000
});

const clampYear = (value) => Math.min(Math.max(value, 1991), 2019);

const buildYearParam = (yearRange) => {
  if (!yearRange) return undefined;
  const start = clampYear(yearRange.start);
  const end = clampYear(yearRange.end);
  return start === end ? `${start}` : `${start}-${end}`;
};

const buildBaseParams = (filters = {}) => {
  const params = {};
  const yearParam = buildYearParam(filters.yearRange);
  if (yearParam) params.year = yearParam;

  if (filters.states?.length === 1) {
    params.state_name = filters.states[0];
  }

  if (filters.parties?.length === 1) {
    params.party = filters.parties[0];
  }

  if (filters.sex && filters.sex !== 'ALL') {
    params.sex = filters.sex;
  }

  if (filters.constituency) {
    params.constituency_name = filters.constituency;
  }

  return params;
};

const applyClientFilters = (records, filters) => {
  let result = [...records];
  if (filters.states?.length > 1) {
    const lookup = new Set(filters.states.map((s) => s.toLowerCase()));
    result = result.filter((row) => lookup.has(row.State_Name?.toLowerCase() || ''));
  } else if (filters.states?.length === 1) {
    // already filtered server-side
  }

  if (filters.parties?.length > 1) {
    const lookup = new Set(filters.parties.map((p) => p.toLowerCase()));
    result = result.filter((row) => lookup.has(row.Party?.toLowerCase() || ''));
  }

  if (filters.sex && filters.sex !== 'ALL') {
    result = result.filter((row) => (row.Sex || '').toUpperCase() === filters.sex);
  }

  if (filters.winnersOnly) {
    result = result.filter((row) => Boolean(row.Is_Winner));
  }

  if (filters.constituency) {
    const needle = filters.constituency.toLowerCase();
    result = result.filter((row) => row.Constituency_Name?.toLowerCase().includes(needle));
  }

  return result;
};

export const electionApi = {
  async getPartySeatShare(filters) {
    const params = { year: buildYearParam(filters.yearRange) };
    const { data } = await api.get('/party/seat-share', { params });
    return data.data || [];
  },

  async getTurnoutByState(filters) {
    const params = { year: buildYearParam(filters.yearRange) };
    const { data } = await api.get('/turnout/by-state', { params });
    return data.data || [];
  },

  async getGenderRepresentation(filters) {
    const params = { year: buildYearParam(filters.yearRange) };
    const { data } = await api.get('/gender/representation', { params });
    return data.data || [];
  },

  async getMarginDistribution(filters) {
    const params = { year: buildYearParam(filters.yearRange) };
    const { data } = await api.get('/margin-distribution', { params });
    return data.data || [];
  },

  async getElections({ filters, page = 1, limit = 100 }) {
    const params = {
      ...buildBaseParams(filters),
      page,
      limit
    };

    const { data } = await api.get('/elections', { params });
    const filteredRows = applyClientFilters(data.data, filters);

    return {
      rows: filteredRows,
      total: data.meta?.total ?? filteredRows.length,
      page,
      limit
    };
  },

  async getVoteShare(filters) {
    const params = {
      ...buildBaseParams(filters),
      limit: 500,
      page: 1
    };
    const { data } = await api.get('/party/vote-share', { params });
    return data.data || [];
  },

  async getEducationAnalysis(filters) {
    const params = { year: buildYearParam(filters.yearRange) };
    const { data } = await api.get('/analysis/education', { params });
    return data.data || [];
  },

  async searchCandidates(query) {
    const params = { q: query, limit: 50 };
    const { data } = await api.get('/search/candidates', { params });
    return data.results;
  },

  async getConstituencyHints(term) {
    const params = {
      constituency_name: term,
      limit: 20,
      page: 1
    };
    const { data } = await api.get('/elections', { params });
    const unique = Array.from(new Set(data.data.map((row) => row.Constituency_Name))).filter(Boolean);
    return unique.slice(0, 10);
  }
};

export const numberFormat = new Intl.NumberFormat('en-IN');
export const percentFormat = new Intl.NumberFormat('en-IN', { style: 'percent', maximumFractionDigits: 1 });
