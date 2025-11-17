const http = require('http');
const app = require('./app');
const config = require('./config');
const db = require('./db/pool');

const server = http.createServer(app);

const start = async () => {
    try {
        await db.query('SELECT 1');
        server.listen(config.port, () => {
            // eslint-disable-next-line no-console
            console.log(`API server listening on port ${config.port}`);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

start();

process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled promise rejection:', reason);
});

process.on('SIGINT', () => {
    // eslint-disable-next-line no-console
    console.log('Gracefully shutting down');
    server.close(() => process.exit(0));
});
