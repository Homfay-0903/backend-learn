// 必须尽早加载 .env 文件，确保后面任何读取 process.env 的代码都能拿到配置值
require('dotenv').config()

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    dbFileName: process.env.DB_FILE_NAME || 'students.db'
}
