
from app.core.db import connection
from app.schemas.student_schema import StudentResponse


def _row_to_student(row) -> StudentResponse:
    return StudentResponse(
        id=row["id"],
        name=row["name"],
        age=row["age"],
        major=row["major"]
    )


def find_all(page: int, page_size: int, major: str | None, sort_by: str, order: str):
    where_clause = "WHERE major = ?" if major else ""
    where_params = (major,) if major else ()
    offset = (page - 1) * page_size

    rows = connection.execute(
        f"""
        SELECT * FROM students
        {where_clause}
        ORDER BY {sort_by} {order}
        LIMIT ? OFFSET ?
        """,
        (*where_params, page_size, offset)
    ).fetchall()

    total = connection.execute(
        f"SELECT COUNT(*) FROM students {where_clause}",
        where_params
    ).fetchone()[0]

    return [_row_to_student(row) for row in rows], total


def find_by_id(student_id: int):
    row = connection.execute(
        "SELECT * FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()

    if row is None:
        return None

    return _row_to_student(row)


def create(data: dict):
    cursor = connection.execute(
        "INSERT INTO students (name, age, major) VALUES (?, ?, ?)",
        (data["name"], data["age"], data["major"])
    )
    connection.commit()

    return find_by_id(cursor.lastrowid)


def update(student_id: int, data: dict):
    cursor = connection.execute(
        "UPDATE students SET name = ?, age = ?, major = ? WHERE id = ?",
        (data["name"], data["age"], data["major"], student_id)
    )
    connection.commit()

    if cursor.rowcount == 0:
        return None

    return find_by_id(student_id)


def remove(student_id: int):
    student = find_by_id(student_id)

    if student is None:
        return False

    connection.execute(
        "DELETE FROM students WHERE id = ?",
        (student_id,)
    )
    connection.commit()

    return True
