
from app.core.exceptions import ApiError
from app.models import course_model
from app.services import student_service


# 复用学生服务的 404 判断，保证"学生不存在"的语义和主资源一致
def _require_student(student_id: int):
    return student_service.get_student_by_id(student_id)


def get_courses(student_id: int):
    _require_student(student_id)
    return course_model.find_by_student_id(student_id)


def create_course(student_id: int, data):
    _require_student(student_id)
    return course_model.create(name=data.name, student_id=student_id)


def update_course(student_id: int, course_id: int, data):
    _require_student(student_id)

    course = course_model.update(course_id, student_id, data.name)

    if course is None:
        raise ApiError(404, "课程不存在")

    return course


def delete_course(student_id: int, course_id: int):
    _require_student(student_id)

    course = course_model.remove(course_id, student_id)

    if course is None:
        raise ApiError(404, "课程不存在")

    return course
