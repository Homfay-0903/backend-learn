const { DatabaseSync } = require('node:sqlite')
const path = require('node:path')

// 数据库文件会生成在项目根目录下，文件不存在时会自动创建
const dbPath = path.join(__dirname, '../../students.db')
const db = new DatabaseSync(dbPath)

// 建表语句：如果表已存在就跳过，保证重复启动服务不会报错
db.exec(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        major TEXT NOT NULL
    )
`)

// 首次运行时表是空的，插入两条初始数据，方便和之前的内存数据保持一致
const { count } = db.prepare('SELECT COUNT(*) AS count FROM students').get()

if (count === 0) {
    const insert = db.prepare(
        'INSERT INTO students (name, age, major) VALUES (?, ?, ?)'
    )

    insert.run('张三', 20, '计算机科学')
    insert.run('李四', 21, '软件工程')
}

module.exports = db
