const crypto = require('node:crypto')

// 把明文密码变成可安全存储的哈希值
// 格式为 "盐:哈希"，两部分都是十六进制字符串，存进数据库的是这一个整体字符串
function hashPassword(password) {
    // 每个用户随机生成 16 字节的盐，保证同样的密码在不同用户那里算出的哈希也不同
    const salt = crypto.randomBytes(16).toString('hex')

    // scrypt 是专门为密码存储设计的慢哈希算法，第三个参数 64 是输出长度（字节）
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')

    return `${salt}:${hash}`
}

// 验证用户输入的密码是否和数据库里存的哈希匹配
function verifyPassword(password, stored) {
    // 数据库里存的是 "盐:哈希"，先拆出当初用的盐
    const [salt, expectedHash] = stored.split(':')

    // 用同样的盐、同样的算法对用户输入的密码再算一遍哈希
    const actualHash = crypto.scryptSync(password, salt, 64).toString('hex')

    // timingSafeEqual 逐字节比对且耗时恒定，能防"按比对耗时猜出前几位正确"的时序攻击
    return crypto.timingSafeEqual(
        Buffer.from(actualHash, 'hex'),
        Buffer.from(expectedHash, 'hex')
    )
}

module.exports = { hashPassword, verifyPassword }
