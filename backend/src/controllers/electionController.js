const db = require('../db/pool');
const { getPagination } = require('../utils/pagination');
const { buildElectionFilters } = require('../utils/queryFilters');

/**
 * Sample response:
 * {
 *   "meta": { "total": 2300, "page": 1, "limit": 100 },
 *   "data": [{ "Year": 2019, "State_Name": "Karnataka", ... }]
 * }
 */
const getElections = async (req, res, next) => {
  try {
    const pagination = getPagination(req.query.page, req.query.limit);
    const { whereClause, values } = buildElectionFilters({
      year: req.query.year,
      stateName: req.query.state_name,
      party: req.query.party,
      sex: req.query.sex,
      constituencyName: req.query.constituency_name
    });

    const sortableClause = 'ORDER BY "Year" DESC, "State_Name" ASC, "Constituency_No" ASC';
    const countQuery = `SELECT COUNT(*) AS total FROM election_data ${whereClause}`;
    const dataQuery = `
      SELECT
        "Year",
        "State_Name",
        "Constituency_Name",
        "Constituency_No",
        "Party",
        "Candidate",
        "Sex",
        "Votes",
        "Valid_Votes",
        "Electors",
        "Turnout_Percentage",
        "Vote_Share_Percentage",
        "Margin",
        "Position",
        "Is_Winner",
        "Is_Winner",
        "Party_Type_TCPD",
        "MyNeta_education"
      FROM election_data
      ${whereClause}
      ${sortableClause}
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const [dataResult, countResult] = await Promise.all([
      db.query(dataQuery, [...values, pagination.limit, pagination.offset]),
      db.query(countQuery, values)
    ]);

    return res.json({
      meta: {
        total: Number.parseInt(countResult.rows[0]?.total ?? '0', 10),
        page: pagination.page,
        limit: pagination.limit
      },
      data: dataResult.rows
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getElections
};
