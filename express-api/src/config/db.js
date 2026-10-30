const { DatabaseSync } = require('node:sqlite')
const path = require('node:path')
const env = require('./env')

// 测试环境下使用内存数据库，不影响本地真实的数据库文件
const dbPath = env.nodeEnv === 'test'
    ? ':memory:'
    : path.join(__dirname, '../../', env.dbFileName)

const db = new DatabaseSync(dbPath)

// SQLite 默认不启用外键约束，每个连接都要单独开启
// （这是 SQLite 的历史遗留设计，其他数据库如 MySQL/PostgreSQL 默认就是开启的）
db.exec('PRAGMA foreign_keys = ON')

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

        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            -- 外键：指向学生的 id；学生被删除时，其课程记录一并删除（级联删除）
            student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE
        );
    `)
}

// 清空并重新插入初始数据，供测试在每个用例开始前重置数据状态
function seedDefaults() {
    db.exec('DROP TABLE IF EXISTS courses')
    db.exec('DROP TABLE IF EXISTS students')
    db.exec('DROP TABLE IF EXISTS users')
    createTable()

    const insert = db.prepare(
        'INSERT INTO students (name, age, major) VALUES (?, ?, ?)'
    )

    insert.run('张三', 20, '计算机科学')
    insert.run('李四', 21, '软件工程')

    // 给两个学生各预置几门课程，方便手动测试关联查询
    const insertCourse = db.prepare(
        'INSERT INTO courses (name, student_id) VALUES (?, ?)'
    )

    insertCourse.run('高等数学', 1)
    insertCourse.run('大学英语', 1)
    insertCourse.run('数据结构', 2)
}

createTable()

// 首次运行时表是空的，插入两条初始数据，方便和之前的内存数据保持一致
const { count } = db.prepare('SELECT COUNT(*) AS count FROM students').get()

if (count === 0) {
    seedDefaults()
}

module.exports = db
module.exports.seedDefaults = seedDefaults
