const env =  process.env.NODE_ENV
let dababase

switch (env) {
  case 'dev':
    dababase = {
      dbName: 'uniapp_douyin',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456'
    }
    break;
  case 'prod':
    dababase = {
      dbName: 'uniapp_douyin',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456'
    }
  default:
    break;
}

module.exports = dababase