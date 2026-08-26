require('reflect-metadata');

const { DataSource } = require('typeorm');
const env = require('./env');
const AdministradorEntity = require('../entities/AdministradorEntity');
const ClienteEntity = require('../entities/ClienteEntity');
const TipoCanchaEntity = require('../entities/TipoCanchaEntity');
const CanchaEntity = require('../entities/CanchaEntity');
const ReservaEntity = require('../entities/ReservaEntity');
const HorarioAtencionEntity = require('../entities/HorarioAtencionEntity');
const FechaBloqueadaEntity = require('../entities/FechaBloqueadaEntity');

const dataSource = new DataSource({
  type: 'mysql',
  host: env.database.host,
  username: env.database.user,
  password: env.database.password,
  database: env.database.name,
  entities: [
    AdministradorEntity,
    ClienteEntity,
    TipoCanchaEntity,
    CanchaEntity,
    ReservaEntity,
    HorarioAtencionEntity,
    FechaBloqueadaEntity
  ],
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
