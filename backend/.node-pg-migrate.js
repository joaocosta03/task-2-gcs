module.exports = {
  migrationFolder: 'migrations',
  direction: 'up',
  sqlFile: false,
  databaseUrl: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
};
