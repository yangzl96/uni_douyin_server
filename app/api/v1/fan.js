const Router = require('koa-router')
const { successData } = require('../../../lib/help')
const { Op } = require('sequelize')
const { Fan } = require('../../../model/Fan')
const { User } = require('../../../model/User')


const router = new Router({
  prefix: '/v1/fans'
})


router.get('/queryMyFollows', async ctx => {
  const { userId, page, pageSize } = ctx.query

  const follow = await Fan.scope('bh').findAll({
    where: {
      fan_id: userId
    }
  })

  const followIds = follow.map(item => item.vloger_id)

  const where = {
    id: {
      [Op.in]: followIds
    }
  }
  const followUser = await User.findAll({
    limit: parseInt(pageSize),
    offset: pageSize * (page - 1),
    where,
    attributes: ['face', 'nickname', ['id', 'vlogerId']]
  })

  followUser.forEach(user => user.setDataValue('followed', true))

  const total = await User.count({ where })

  successData(ctx, { rows: followUser, total })
})

router.get('/queryMyFans', async ctx => {
  const { userId, page, pageSize } = ctx.query

  const fans = await Fan.scope('bh').findAll({
    where: {
      vloger_id: userId
    }
  })
  const fansIds = []
  fans.forEach(item => {
    fansIds.push(item.fan_id)
  })

  const where = {
    id: {
      [Op.in]: fansIds
    }
  }
  const fansIdsUser = await User.findAll({
    limit: parseInt(pageSize),
    offset: pageSize * (page - 1),
    where,
    attributes: ['face', 'nickname', ['id', 'vlogerId']]
  })

  for (let i = 0; i < fans.length; i++) {
    for (let j = 0; j < fansIdsUser.length; j++) {
      const v = fans[i].is_fan_friend_of_mine === 1 ? true : false
      console.log(v)
      fansIdsUser[i].setDataValue('friend', v)
      break
    }
  }

  const total = await User.count({ where })

  successData(ctx, { rows: fansIdsUser, total })
})

module.exports = router

