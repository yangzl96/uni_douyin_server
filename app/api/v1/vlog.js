const Router = require('koa-router')
const { Op } = require('sequelize')
const { guid } = require('../../../core/util')
const { successData } = require('../../../lib/help')
const { Fan } = require('../../../model/Fan')
const { MyLikedVlog } = require('../../../model/MyLikedVlog.js.js')
const { User } = require('../../../model/User')
const { Vlog } = require('../../../model/Vlog')

const router = new Router({
  prefix: '/v1/vlog'
})

router.get('/indexList', async ctx => {
  const { userId, page, pageSize, search } = ctx.query
  const where = {}
  if (search) {
    where.title = {
      [Op.like]: `%${search}%`
    }
  }
  // 列表
  const vlogs = await Vlog.findAll({
    limit: parseInt(pageSize),
    offset: pageSize * (page - 1),
    // 关联
    include: [{
      model: User,
      as: 'user',
      attributes: [['id', 'vlogerId'], ['face', 'vlogerFace'], ['nickname', 'vlogerName']]
    }],
    where,
  })
  // 总数
  let total = 0
  if (!search) {
    total = await Vlog.count();
  } else {
    total = await Vlog.count({ where });
  }
  // 设置是否喜欢
  for (let vlog of vlogs) {
    const isLike = await MyLikedVlog.scope('bh').findOne({
      where: {
        user_id: userId,
        vlog_id: vlog.id
      }
    })
    if (isLike) {
      vlog.setDataValue('doILikeThisVlog', true)
    }
  }

  successData(ctx, { rows: vlogs, total })
})

router.get('/totalLikedCounts', async ctx => {
  const { vlogId } = ctx.query
  const vlogs = await Vlog.findOne({
    where: {
      id: vlogId
    }
  })
  successData(ctx, vlogs.like_counts)
})

router.post('/like', async ctx => {
  const { userId: user_id, vlogerId, vlogId: vlog_id } = ctx.query

  await MyLikedVlog.create({
    id: guid(),
    user_id,
    vlog_id
  })

  successData(ctx)
})

router.post('/unlike', async ctx => {
  const { userId: user_id, vlogerId, vlogId: vlog_id } = ctx.query
  const a = await MyLikedVlog.destroy({
    where: {
      user_id,
      vlog_id
    }
  })

  successData(ctx)
})

router.get('/followList', async ctx => {
  const { userId, page, pageSize } = ctx.query

  const myFollow = await Fan.scope('bh').findAll({
    where: {
      fan_id: userId
    }
  })

  const followIds = myFollow.map(item => item.vloger_id)
  console.log(followIds)
  // 列表
  const vlogs = await Vlog.findAll({
    limit: parseInt(pageSize),
    offset: pageSize * (page - 1),
    where: {
      vloger_id: {
        [Op.in]: followIds
      }
    },
    // 关联
    include: [{
      model: User,
      as: 'user',
      attributes: [['id', 'vlogerId'], ['face', 'vlogerFace'], ['nickname', 'vlogerName']]
    }],
  })
  // 设置是否喜欢
  for (let vlog of vlogs) {
    const isLike = await MyLikedVlog.scope('bh').findOne({
      where: {
        user_id: userId,
        vlog_id: vlog.id
      }
    })
    if (isLike) {
      vlog.setDataValue('doILikeThisVlog', true)
    }
  }

  successData(ctx, { rows: vlogs, total: vlogs.length })
})

router.get('/detail', async ctx => {
  const { userId, vlogId } = ctx.query

  // 列表
  const vlog = await Vlog.findOne({
    where: {
      id: vlogId
    },
    // 关联
    include: [{
      model: User,
      as: 'user',
      attributes: [['id', 'vlogerId'], ['face', 'vlogerFace'], ['nickname', 'vlogerName']]
    }],
  })
  // 设置是否喜欢
  const isLike = await MyLikedVlog.scope('bh').findOne({
    where: {
      user_id: userId,
      vlog_id: vlogId
    }
  })
  if (isLike) {
    vlog.setDataValue('doILikeThisVlog', true)
  }

  successData(ctx, vlog)
})

router.get('/:listRouteType', async ctx => {
  const { listRouteType } = ctx.params
  const { userId: user_id, page, pageSize } = ctx.query
  const where = {}
  switch (listRouteType) {
    case 'myPublicList':
      where.vloger_id = user_id
      where.is_private = 0
      break;
    case 'myPrivateList':
      where.vloger_id = user_id
      where.is_private = 1
      break;
    case 'myLikedList':
      // 先找出他点赞过的
      const likes = await MyLikedVlog.findAll({
        where: {
          user_id
        }
      })
      // 获取喜欢的视频id
      const likeArr = likes.map(item => item.vlog_id)
      where.id = {
        [Op.in]: likeArr
      }
      break;
    default:
      break;
  }
  const vlogs = await Vlog.findAll({
    limit: parseInt(pageSize),
    offset: pageSize * (page - 1),
    where,
  })

  const total = await Vlog.count({ where });

  successData(ctx, { rows: vlogs, total })
})




module.exports = router
