class HttpException extends Error {
  constructor(msg = '服务器异常', errorCode = 10000, code = 400) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

class ParameterException extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 400
    this.msg = msg || '参数错误'
    this.errorCode = errorCode || 10000
  }
}

class SuccessInfo extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 200
    this.msg = msg || 'success'
    this.errorCode = errorCode || 0
  }
}

class NotFound extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 404
    this.msg = msg || '资源未找到'
    this.errorCode = errorCode || 10000
  }
}

class AuthFailed extends HttpException {
  constructor(msg, errorCode) {
    console.log(msg)
    super()
    this.code = 401
    this.msg = msg || '授权失败'
    this.errorCode = errorCode || 10004
  }
}

class Forbidden extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 403
    this.msg = msg || '禁止访问'
    this.errorCode = errorCode || 10006
  }
}

// ----------------------------------------------------------

module.exports = {
  HttpException,
  ParameterException,
  NotFound,
  AuthFailed,
  Forbidden,
  SuccessInfo,
}