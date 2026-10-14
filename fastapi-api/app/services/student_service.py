
from app.models import student_model
from app.core.exceptions import ApiError
from app.schemas.student_schema import StudentCreate


def get_all_students():
    return student_model.find_all()


def get_student_by_id(student_id: int):
    student = student_model.find_by_id(student_id)

    if student is None:
        raise ApiError(404, "学生不存在")

    return student


def create_student(data: StudentCreate):
    student_data = data.model_dump()
    return student_model.create(student_data)


def update_student(student_id: int, data: StudentCreate):
    get_student_by_id(student_id)

    student_data = data.model_dump()

    return student_model.update(
        student_id,
        student_data
    )


def delete_student(student_id: int):
    get_student_by_id(student_id)

    return student_model.remove(student_id)
