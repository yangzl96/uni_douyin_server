const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../core/db')
const { User } = require('./User.js')

class Vlog extends Model {

}

Vlog.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  vloger_id: {
    type: Sequelize.STRING,
  },
  url: Sequelize.STRING,
  cover: Sequelize.STRING,
  title: Sequelize.STRING,
  height: Sequelize.INTEGER,
  width: Sequelize.INTEGER,
  like_counts: Sequelize.INTEGER,
  comments_counts: Sequelize.INTEGER,
  is_private: Sequelize.INTEGER,
  title: Sequelize.INTEGER,
}, {
  sequelize,
  freezeTableName: true
}
)


Vlog.belongsTo(User, { as: 'user', foreignKey: 'vloger_id' })


module.exports = {
  Vlog
}