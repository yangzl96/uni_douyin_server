const Router = require('koa-router')

const router = new Router({
  prefix: '/v1/douyin'
})

router.get('/', async ctx => {
  ctx.body = 'success'
})

router.post('/test', async ctx => {
  ctx.body = {
    msg: 'post success',
    data: ctx.body.request
  }
})

module.exports = router