const sanitizeLike = (value) => value.replace(/%/g, '\\%').replace(/_/g, '\\_');

const parseYearRange = (yearParam) => {
  if (!yearParam) return null;
  const cleaned = yearParam.toString().trim();
  if (!cleaned) return null;

  if (cleaned.includes('-')) {
    const [startRaw, endRaw] = cleaned.split('-').map((part) => part.trim());
    const start = Number.parseInt(startRaw, 10);
    const end = Number.parseInt(endRaw, 10);
    if (Number.isNaN(start) || Number.isNaN(end)) {
      return null;
    }
    return {
      from: Math.min(start, end),
      to: Math.max(start, end)
    };
  }

  const singleYear = Number.parseInt(cleaned, 10);
  if (Number.isNaN(singleYear)) {
    return null;
  }

  return { from: singleYear, to: singleYear };
};

const buildElectionFilters = ({
  year,
  stateName,
  party,
  sex,
  constituencyName
}) => {
  const clauses = [];
  const values = [];

  const yearRange = parseYearRange(year);
  if (yearRange) {
    const fromIdx = values.push(yearRange.from);
    const toIdx = values.push(yearRange.to);
    clauses.push(`"Year" BETWEEN $${fromIdx} AND $${toIdx}`);
  }

  if (stateName) {
    const idx = values.push(`%${sanitizeLike(stateName)}%`);
    clauses.push(`"State_Name" ILIKE $${idx}`);
  }

  if (party) {
    const idx = values.push(`%${sanitizeLike(party)}%`);
    clauses.push(`"Party" ILIKE $${idx}`);
  }

  if (sex) {
    const idx = values.push(sex.toUpperCase());
    clauses.push(`"Sex" = $${idx}`);
  }

  if (constituencyName) {
    const idx = values.push(`%${sanitizeLike(constituencyName)}%`);
    clauses.push(`"Constituency_Name" ILIKE $${idx}`);
  }

  return {
    whereClause: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
    yearRange
  };
};

module.exports = {
  parseYearRange,
  buildElectionFilters,
  sanitizeLike
};
