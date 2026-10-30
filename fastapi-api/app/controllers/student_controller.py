
from app.services import student_service
from app.schemas.student_schema import StudentCreate


def get_all_students(query):
    result = student_service.get_all_students(query)

    return {
        "success": True,
        "data": result["data"],
        "pagination": result["pagination"]
    }


def get_student_by_id(student_id: int):
    # 返回学生详情，附带课程列表（与 Express 侧行为一致）
    student = student_service.get_student_with_courses(student_id)

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
