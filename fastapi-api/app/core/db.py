import sqlite3
from pathlib import Path

from app.core.config import ENV, DB_FILE_NAME

# 测试环境下使用内存数据库，不影响本地真实的数据库文件
DB_PATH = (
    ":memory:"
    if ENV == "test"
    else Path(__file__).resolve().parent.parent.parent / DB_FILE_NAME
)

connection = sqlite3.connect(DB_PATH, check_same_thread=False)
connection.row_factory = sqlite3.Row

# SQLite 默认不启用外键约束，每个连接都要单独开启
# （这是 SQLite 的历史遗留设计，其他数据库如 MySQL/PostgreSQL 默认就是开启的）
connection.execute("PRAGMA foreign_keys = ON")


def create_table():
    # 建表语句：如果表已存在就跳过，保证重复启动服务不会报错
    connection.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            major TEXT NOT NULL
        )
    """)
    connection.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )
    """)
    connection.execute("""
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            -- 外键：指向学生的 id；学生被删除时，其课程记录一并删除（级联删除）
            student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE
        )
    """)


def seed_defaults():
    # 清空并重新插入两条初始数据，供测试在每个用例开始前重置数据状态
    # 有外键指向 students，所以必须先删 courses 再删 students
    connection.execute("DROP TABLE IF EXISTS courses")
    connection.execute("DROP TABLE IF EXISTS students")
    connection.execute("DROP TABLE IF EXISTS users")
    create_table()

    connection.executemany(
        "INSERT INTO students (name, age, major) VALUES (?, ?, ?)",
        [
            ("张三", 20, "计算机科学"),
            ("李四", 21, "软件工程"),
        ]
    )

    # 给两个学生各预置几门课程，方便手动测试关联查询
    connection.executemany(
        "INSERT INTO courses (name, student_id) VALUES (?, ?)",
        [
            ("高等数学", 1),
            ("大学英语", 1),
            ("数据结构", 2),
        ]
    )
    connection.commit()


create_table()

# 首次运行时表是空的，插入两条初始数据
count = connection.execute("SELECT COUNT(*) FROM students").fetchone()[0]

if count == 0:
    seed_defaults()
