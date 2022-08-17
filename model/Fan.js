const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../core/db')

class Fan extends Model {

}


Fan.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  vloger_id: Sequelize.STRING,
  fan_id: Sequelize.STRING,
  // 粉丝是否是vloger的朋友，如果成为朋友，
  // 则本表的双方此字段都需要设置为1，
  // 如果有一人取关，则两边都需要设置为0
  is_fan_friend_of_mine: Sequelize.INTEGER,
}, {
  sequelize
}
)

module.exports = {
  Fan
}
