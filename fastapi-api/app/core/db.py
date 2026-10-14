import sqlite3
from pathlib import Path

# 数据库文件生成在项目根目录下，文件不存在时会自动创建
DB_PATH = Path(__file__).resolve().parent.parent.parent / "students.db"

connection = sqlite3.connect(DB_PATH, check_same_thread=False)
connection.row_factory = sqlite3.Row

# 建表语句：如果表已存在就跳过，保证重复启动服务不会报错
connection.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        major TEXT NOT NULL
    )
""")

# 首次运行时表是空的，插入两条初始数据
count = connection.execute("SELECT COUNT(*) FROM students").fetchone()[0]

if count == 0:
    connection.executemany(
        "INSERT INTO students (name, age, major) VALUES (?, ?, ?)",
        [
            ("张三", 20, "计算机科学"),
            ("李四", 21, "软件工程"),
        ]
    )
    connection.commit()
