const db = require('../config/db')

function createUser({ username, passwordHash }) {
    const result = db.prepare(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)'
    ).run(username, passwordHash)

    // lastInsertRowid 是 node:sqlite 返回的 BigInt，需要转成 Number 才能绑定到 ? 参数
    return findUserById(Number(result.lastInsertRowid))
}

function findUserById(id) {
    return db.prepare(
        'SELECT id, username, password_hash FROM users WHERE id = ?'
    ).get(id)
}

function findByUsername(username) {
    return db.prepare(
        'SELECT id, username, password_hash FROM users WHERE username = ?'
    ).get(username)
}

module.exports = { createUser, findUserById, findByUsername }
