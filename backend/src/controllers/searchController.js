const db = require('../db/pool');
const { sanitizeLike } = require('../utils/queryFilters');

/**
 * Sample response:
 * {
 *   "query": "rao",
 *   "results": [
 *     {
 *       "candidate": "Anitha Rao",
 *       "history": [
 *         { "year": 2019, "state": "Karnataka", "party": "INC", "votes": 523456 }
 *       ]
 *     }
 *   ]
 * }
 */
const searchCandidates = async (req, res, next) => {
  try {
    const limit = Math.min(Number.parseInt(req.query.limit || '50', 10), 200);
    const searchTerm = `%${sanitizeLike(req.query.q)}%`;

    const query = `
      SELECT
        "Candidate" AS candidate,
        "Year" AS year,
        "State_Name" AS state,
        "Constituency_Name" AS constituency,
        "Party" AS party,
        "Votes" AS votes,
        "Vote_Share_Percentage" AS vote_share_percentage,
        "Margin" AS margin,
        "Is_Winner" AS is_winner,
        "Position" AS position
      FROM election_data
      WHERE "Candidate" ILIKE $1
      ORDER BY candidate ASC, year DESC
      LIMIT $2
    `;

    const { rows } = await db.query(query, [searchTerm, limit]);

    const grouped = rows.reduce((acc, row) => {
      if (!acc[row.candidate]) {
        acc[row.candidate] = [];
      }
      acc[row.candidate].push({
        year: row.year,
        state: row.state,
        constituency: row.constituency,
        party: row.party,
        votes: row.votes,
        vote_share_percentage: row.vote_share_percentage,
        margin: row.margin,
        is_winner: row.is_winner,
        position: row.position
      });
      return acc;
    }, {});

    const results = Object.entries(grouped).map(([candidate, history]) => ({
      candidate,
      history
    }));

    return res.json({
      query: req.query.q,
      count: results.length,
      results
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  searchCandidates
};
