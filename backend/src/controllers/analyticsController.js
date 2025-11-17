const db = require('../db/pool');
const { parseYearRange } = require('../utils/queryFilters');

const buildYearClause = (yearParam) => {
  const values = [];
  const conditions = [];
  const range = parseYearRange(yearParam);

  if (range) {
    const fromIdx = values.push(range.from);
    const toIdx = values.push(range.to);
    conditions.push(`"Year" BETWEEN $${fromIdx} AND $${toIdx}`);
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
    range
  };
};

const getTurnoutByState = async (req, res, next) => {
  try {
    const { where, values, range } = buildYearClause(req.query.year);
    const query = `
      SELECT
        "State_Name" AS state,
        ROUND(AVG("Turnout_Percentage")::numeric, 2) AS avg_turnout
      FROM election_data
      ${where}
      GROUP BY "State_Name"
      ORDER BY state
    `;

    const { rows } = await db.query(query, values);
    return res.json({
      meta: { yearRange: range || null },
      data: rows
    });
  } catch (error) {
    return next(error);
  }
};

const getPartySeatShare = async (req, res, next) => {
  try {
    const { where, values, range } = buildYearClause(req.query.year);
    const whereClause = where ? `${where} AND "Is_Winner" = true` : 'WHERE "Is_Winner" = true';
    const query = `
      SELECT
        "Year" AS year,
        "Party" AS party,
        COUNT(*) AS seats_won
      FROM election_data
      ${whereClause}
      GROUP BY year, party
      ORDER BY year ASC, seats_won DESC
    `;

    const { rows } = await db.query(query, values);
    return res.json({ meta: { yearRange: range || null }, data: rows });
  } catch (error) {
    return next(error);
  }
};

const getGenderRepresentation = async (req, res, next) => {
  try {
    const { where, values, range } = buildYearClause(req.query.year);
    const whereClause = where ? `${where} AND "Sex" IS NOT NULL` : 'WHERE "Sex" IS NOT NULL';
    const query = `
      WITH gender_counts AS (
        SELECT
          "Year" AS year,
          CASE
            WHEN "Sex" IS NULL OR "Sex" = '' THEN 'UNKNOWN'
            ELSE UPPER("Sex")
          END AS sex,
          COUNT(*) AS candidates
        FROM election_data
        ${whereClause}
        GROUP BY year, sex
      )
      SELECT
        year,
        sex,
        candidates,
        ROUND(candidates * 100.0 / NULLIF(SUM(candidates) OVER (PARTITION BY year), 0), 2) AS percentage
      FROM gender_counts
      ORDER BY year ASC, sex ASC
    `;

    const { rows } = await db.query(query, values);
    return res.json({ meta: { yearRange: range || null }, data: rows });
  } catch (error) {
    return next(error);
  }
};

const getMarginDistribution = async (req, res, next) => {
  try {
    const { where, values, range } = buildYearClause(req.query.year);
    const conditions = [
      '"Margin" IS NOT NULL'
    ];
    if (where) {
      conditions.push(where.replace('WHERE ', ''));
    }
    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const query = `
      WITH grouped AS (
        SELECT
          CASE
            WHEN "Margin" < 1000 THEN '0-999'
            WHEN "Margin" < 5000 THEN '1k-4.9k'
            WHEN "Margin" < 10000 THEN '5k-9.9k'
            WHEN "Margin" < 50000 THEN '10k-49.9k'
            ELSE '50k+'
          END AS bucket,
          CASE
            WHEN "Margin" < 1000 THEN 1
            WHEN "Margin" < 5000 THEN 2
            WHEN "Margin" < 10000 THEN 3
            WHEN "Margin" < 50000 THEN 4
            ELSE 5
          END AS bucket_order
        FROM election_data
        ${whereClause}
      )
      SELECT bucket, SUM(1) AS races
      FROM grouped
      GROUP BY bucket, bucket_order
      ORDER BY bucket_order
    `;

    const { rows } = await db.query(query, values);
    return res.json({ meta: { yearRange: range || null }, data: rows });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getTurnoutByState,
  getPartySeatShare,
  getGenderRepresentation,
  getMarginDistribution
};
