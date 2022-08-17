
// 将成功的时候 也当成一个错误，向外抛出
function successInfo(msg, errorCode) {
  throw new global.errs.SuccessInfo(msg, errorCode)
}

function successData(ctx, data, msg = 'success', errorCode = 0, code = 200) {
  console.log(data)
  return ctx.body = {
    msg,
    errorCode,
    code,
    status:200,
    data
  }
}

module.exports = {
  successInfo,
  successData
}