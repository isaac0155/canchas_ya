require('reflect-metadata');

const { DataSource } = require('typeorm');
const env = require('./env');
const ReservaEntity = require('../entities/ReservaEntity');

const dataSource = new DataSource({
  type: 'mysql',
  host: env.database.host,
  username: env.database.user,
  password: env.database.password,
  database: env.database.name,
  entities: [ReservaEntity],
  synchronize: false
});

async function iniciarTypeOrm() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
}

module.exports = {
  dataSource,
  iniciarTypeOrm
};
