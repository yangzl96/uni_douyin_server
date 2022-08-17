const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../core/db')

class MyLikedVlog extends Model {

}

MyLikedVlog.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  user_id: Sequelize.STRING,
  vlog_id: Sequelize.STRING,
}, {
  sequelize,
  tableName: 'my_liked_vlog'
}
)

// MyLikedVlog.belongsTo(User, { as: 'user', foreignKey: 'user_id' })


module.exports = {
  MyLikedVlog
}