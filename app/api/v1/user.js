const Router = require('koa-router')
const { LoginValidator } = require('../../../validators/validators')
const { User } = require('../../../model/User')
const { successInfo, successData } = require('../../../lib/help')
const { generateToken } = require('../../../core/util')
const { Fan } = require('../../../model/Fan')
const { Vlog } = require('../../../model/Vlog')
const { sequelize } = require('../../../core/db')
const { QueryTypes } = require('sequelize');

const router = new Router({
  prefix: '/v1/user'
})

// 登录
router.post('/login', async ctx => {
  const v = await new LoginValidator().validate(ctx)
  const user = {
    mobile: v.get('body.mobile'),
    smsCode: v.get('body.smsCode')
  }
  const userInfo = await User.findOne({ where: { mobile: user.mobile } })
  const { id, mobile } = userInfo
  // 生成token
  const userToken = generateToken(id, mobile)
  userInfo.setDataValue('userToken', userToken)
  successData(ctx, userInfo)
})

// 查询用户信息
router.get('/info', async ctx => {
  const { userId } = ctx.query
  // 基本信息
  const user = await User.findByPk(userId)
  if (!user) {
    throw new global.errs.NotFound('用户信息不存在')
  }

  const where = {
    vloger_id: userId
  }
  // 粉丝数
  const fans = await Fan.count({
    where
  })
  user.setDataValue('myFansCounts', fans)

  // 获赞次数
  const likeCount = await sequelize.query("SELECT SUM(like_counts) as totalLikeMeCounts from vlog where vloger_id = '1001'", {
    raw: true,
    plain: true,
    type: QueryTypes.SELECT
  });
  user.setDataValue('totalLikeMeCounts', likeCount.totalLikeMeCounts)

  // 我关注的
  const follow = await Fan.count({
    where: {
      fan_id: userId
    }
  })
  user.setDataValue('myFollowsCounts', follow)
  successData(ctx, user)
})

module.exports = router