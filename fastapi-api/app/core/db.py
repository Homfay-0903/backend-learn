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


def seed_defaults():
    # 清空并重新插入两条初始数据，供测试在每个用例开始前重置数据状态
    connection.execute("DROP TABLE IF EXISTS students")
    create_table()

    connection.executemany(
        "INSERT INTO students (name, age, major) VALUES (?, ?, ?)",
        [
            ("张三", 20, "计算机科学"),
            ("李四", 21, "软件工程"),
        ]
    )
    connection.commit()


create_table()

# 首次运行时表是空的，插入两条初始数据
count = connection.execute("SELECT COUNT(*) FROM students").fetchone()[0]

if count == 0:
    seed_defaults()
