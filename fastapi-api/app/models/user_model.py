
from app.core.db import connection
from app.schemas.user_schema import UserResponse


def _row_to_user(row) -> UserResponse:
    return UserResponse(
        id=row["id"],
        username=row["username"]
    )


def create_user(username: str, password_hash: str) -> UserResponse:
    cursor = connection.execute(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        (username, password_hash)
    )
    connection.commit()

    # cursor.lastrowid 是 SQLite 给自增主键分配的 id
    return find_by_id(cursor.lastrowid)


def find_by_id(user_id: int) -> UserResponse | None:
    row = connection.execute(
        "SELECT id, username FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()

    if row is None:
        return None

    return _row_to_user(row)


def find_by_username_with_password(username: str):
    """只供登录流程使用：返回带密码哈希的完整行，绝不能外泄到响应里"""
    return connection.execute(
        "SELECT id, username, password_hash FROM users WHERE username = ?",
        (username,)
    ).fetchone()
