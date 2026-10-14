
from app.schemas.student_schema import StudentResponse


# 模拟数据库
students = [
    StudentResponse(
        id=1,
        name="张三",
        age=20,
        major="计算机科学"
    ),
    StudentResponse(
        id=2,
        name="李四",
        age=21,
        major="软件工程"
    )
]

next_id = 3


def find_all():
    return students


def find_by_id(student_id: int):
    for student in students:
        if student.id == student_id:
            return student

    return None


def create(data: dict):
    global next_id

    student = StudentResponse(
        id=next_id,
        **data
    )

    next_id += 1
    students.append(student)

    return student


def update(student_id: int, data: dict):
    for index, student in enumerate(students):
        if student.id == student_id:
            updated_student = StudentResponse(
                id=student_id,
                **data
            )

            students[index] = updated_student
            return updated_student

    return None


def remove(student_id: int):
    for index, student in enumerate(students):
        if student.id == student_id:
            students.pop(index)
            return True

    return False
