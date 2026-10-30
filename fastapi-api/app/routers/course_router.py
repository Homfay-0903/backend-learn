
from fastapi import APIRouter

from app.controllers import course_controller
from app.schemas.course_schema import CourseCreate

# 嵌套路由：课程是学生的子资源，URL 里体现归属关系。
# FastAPI 的 APIRouter 挂载时天然共享父路由的路径参数，不需要类似
# Express mergeParams 的开关——路径参数在整个链路上都是可见的
router = APIRouter()


@router.get("")
def get_courses(student_id: int):
    return {
        "success": True,
        "data": course_controller.get_courses(student_id)
    }


@router.post("", status_code=201)
def create_course(student_id: int, data: CourseCreate):
    return course_controller.create_course(student_id, data)


@router.put("/{course_id}")
def update_course(student_id: int, course_id: int, data: CourseCreate):
    return course_controller.update_course(student_id, course_id, data)


@router.delete("/{course_id}")
def delete_course(student_id: int, course_id: int):
    return course_controller.delete_course(student_id, course_id)
