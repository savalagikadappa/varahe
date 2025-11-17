const config = require('../config');

const getPagination = (pageParam, limitParam) => {
  const page = Math.max(parseInt(pageParam || '1', 10), 1);
  const limit = Math.min(
    Math.max(parseInt(limitParam || config.pagination.defaultLimit.toString(), 10), 1),
    config.pagination.maxLimit
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

module.exports = { getPagination };
