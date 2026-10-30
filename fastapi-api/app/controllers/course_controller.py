
from app.services import course_service
from app.schemas.course_schema import CourseCreate


def get_courses(student_id: int):
    return course_service.get_courses(student_id)


def create_course(student_id: int, data: CourseCreate):
    course = course_service.create_course(student_id, data)

    return {
        "success": True,
        "message": "创建成功",
        "data": course
    }


def update_course(student_id: int, course_id: int, data: CourseCreate):
    course = course_service.update_course(student_id, course_id, data)

    return {
        "success": True,
        "message": "修改成功",
        "data": course
    }


def delete_course(student_id: int, course_id: int):
    course_service.delete_course(student_id, course_id)

    return {
        "success": True,
        "message": "删除成功"
    }
