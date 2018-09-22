const { database } = require('../config/env');
const Sequelize = require('sequelize');

const db = new Sequelize(
  database.dbname,
  database.username,
  database.password, {
    host: database.host,
    port: database.port,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

const dbService = () => {
  const successfulDBStart = () => (
    console.info('Connection to the database has been established successfully')
  );

  const errorDBStart = (err) => (
    console.info('Unable to connect to the database:', err)
  );

  const start = async () => {
    try {
      await db.sync();
      successfulDBStart();
    } catch(err) {
      errorDBStart(err);
    }
  };

  return {
    start
  };
};

module.exports = {
  dbService,
  db
};
