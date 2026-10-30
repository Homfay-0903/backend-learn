
from app.core.db import connection
from app.schemas.course_schema import CourseResponse


def _row_to_course(row) -> CourseResponse:
    return CourseResponse(
        id=row["id"],
        name=row["name"],
        studentId=row["student_id"]
    )


def find_by_student_id(student_id: int) -> list[CourseResponse]:
    rows = connection.execute(
        "SELECT id, name, student_id FROM courses WHERE student_id = ? ORDER BY id",
        (student_id,)
    ).fetchall()

    return [_row_to_course(row) for row in rows]


def find_by_id_and_student(course_id: int, student_id: int) -> CourseResponse | None:
    row = connection.execute(
        "SELECT id, name, student_id FROM courses WHERE id = ? AND student_id = ?",
        (course_id, student_id)
    ).fetchone()

    if row is None:
        return None

    return _row_to_course(row)


def create(name: str, student_id: int) -> CourseResponse:
    cursor = connection.execute(
        "INSERT INTO courses (name, student_id) VALUES (?, ?)",
        (name, student_id)
    )
    connection.commit()

    return find_by_id_and_student(cursor.lastrowid, student_id)


def update(course_id: int, student_id: int, name: str) -> CourseResponse | None:
    # WHERE 里带上 student_id，防止跨学生篡改他人的课程
    cursor = connection.execute(
        "UPDATE courses SET name = ? WHERE id = ? AND student_id = ?",
        (name, course_id, student_id)
    )
    connection.commit()

    if cursor.rowcount == 0:
        return None

    return find_by_id_and_student(course_id, student_id)


def remove(course_id: int, student_id: int) -> CourseResponse | None:
    course = find_by_id_and_student(course_id, student_id)

    if course is None:
        return None

    connection.execute(
        "DELETE FROM courses WHERE id = ? AND student_id = ?",
        (course_id, student_id)
    )
    connection.commit()

    return course
