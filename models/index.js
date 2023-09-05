'use strict'

const fs = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')
const process = require('process')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../config/config.json')[env]
const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    )
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

// db.users = require('./User')(sequelize, DataTypes)
// db.communities = require('./Community')(sequelize, DataTypes)
// db.members = require('./Member')(sequelize, DataTypes)
// db.role = require('./Role')(sequelize, DataTypes)

// db.sequelize.sync({ force: false })
//   .then(() => {
//     console.log('yes re-sync done!')
//   })

// db.users.hasMany(db.communities, {
//   foreignKey: 'owner',
//   sourceKey: 'id',
//   as: 'ownedCommunities',
// })

// db.users.hasMany(db.members, {
//   foreignKey: 'user',
//   sourceKey: 'id',
//   as: 'memberships',
// })

// db.communities.belongsTo(db.users, {
//   foreignKey: 'owner',
//   targetKey: 'id',
//   as: 'ownerData',
// })

// db.communities.hasMany(db.members, {
//   foreignKey: 'community',
//   sourceKey: 'id',
//   as: 'members',
// })

// db.members.belongsTo(db.users, {
//   foreignKey: 'user',
//   targetKey: 'id',
//   as: 'userData',
// })

// db.members.belongsTo(db.communities, {
//   foreignKey: 'community',
//   targetKey: 'id',
//   as: 'communityData',
// })

module.exports = db
