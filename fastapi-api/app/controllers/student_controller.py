
from app.services import student_service
from app.schemas.student_schema import StudentCreate


def get_all_students():
    students = student_service.get_all_students()

    return {
        "success": True,
        "data": students
    }


def get_student_by_id(student_id: int):
    student = student_service.get_student_by_id(student_id)

    return {
        "success": True,
        "data": student
    }


def create_student(data: StudentCreate):
    student = student_service.create_student(data)

    return {
        "success": True,
        "message": "创建成功",
        "data": student
    }


def update_student(student_id: int, data: StudentCreate):
    student = student_service.update_student(
        student_id,
        data
    )

    return {
        "success": True,
        "message": "修改成功",
        "data": student
    }


def delete_student(student_id: int):
    student_service.delete_student(student_id)

    return {
        "success": True,
        "message": "删除成功"
    }
