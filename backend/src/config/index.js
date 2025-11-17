const dotenv = require('dotenv');

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'kadappa',
    password: process.env.DB_PASSWORD || 'kadappa',
    database: process.env.DB_NAME || 'varahe',
    ssl: process.env.DB_SSL === 'true'
  },
  pagination: {
    defaultLimit: parseInt(process.env.PAGE_LIMIT || '100', 10),
    maxLimit: parseInt(process.env.MAX_PAGE_LIMIT || '500', 10)
  }
};

module.exports = config;
