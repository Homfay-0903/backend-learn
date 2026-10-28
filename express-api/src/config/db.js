const { DatabaseSync } = require('node:sqlite')
const path = require('node:path')
const env = require('./env')

// 测试环境下使用内存数据库，不影响本地真实的数据库文件
const dbPath = env.nodeEnv === 'test'
    ? ':memory:'
    : path.join(__dirname, '../../', env.dbFileName)

const db = new DatabaseSync(dbPath)

function createTable() {
    // 建表语句：如果表已存在就跳过，保证重复启动服务不会报错
    db.exec(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            major TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        );
    `)
}

// 清空并重新插入初始数据，供测试在每个用例开始前重置数据状态
function seedDefaults() {
    db.exec('DROP TABLE IF EXISTS students')
    db.exec('DROP TABLE IF EXISTS users')
    createTable()

    const insert = db.prepare(
        'INSERT INTO students (name, age, major) VALUES (?, ?, ?)'
    )

    insert.run('张三', 20, '计算机科学')
    insert.run('李四', 21, '软件工程')
}

createTable()

// 首次运行时表是空的，插入两条初始数据，方便和之前的内存数据保持一致
const { count } = db.prepare('SELECT COUNT(*) AS count FROM students').get()

if (count === 0) {
    seedDefaults()
}

module.exports = db
module.exports.seedDefaults = seedDefaults
