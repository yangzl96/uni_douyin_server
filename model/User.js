/**
 * 用户表
 */
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../core/db')

class User extends Model {

}

User.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  mobile: Sequelize.STRING,
  nickname: Sequelize.STRING,
  country: Sequelize.STRING,
  province: Sequelize.STRING,
  city: Sequelize.STRING,
  birthday: Sequelize.STRING,
  district: Sequelize.STRING,
  bg_img: Sequelize.STRING,
  can_imooc_num_be_updated: Sequelize.INTEGER,
  description: Sequelize.STRING,
  imooc_num: Sequelize.INTEGER,
  sex: Sequelize.INTEGER,
  face: Sequelize.STRING,
}, {
  sequelize
})

module.exports = {
  User
}