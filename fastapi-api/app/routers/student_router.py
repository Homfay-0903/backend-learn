
from fastapi import APIRouter
from app.controllers import student_controller
from app.schemas.student_schema import StudentCreate

router = APIRouter(
    prefix="/api/students",
    tags=["Students"]
)


# 查询全部学生
@router.get("")
def get_all_students():
    return student_controller.get_all_students()


# 查询单个学生
@router.get("/{student_id}")
def get_student_by_id(student_id: int):
    return student_controller.get_student_by_id(student_id)


# 新增学生
@router.post("", status_code=201)
def create_student(data: StudentCreate):
    return student_controller.create_student(data)


# 修改学生
@router.put("/{student_id}")
def update_student(student_id: int, data: StudentCreate):
    return student_controller.update_student(
        student_id,
        data
    )


# 删除学生
@router.delete("/{student_id}")
def delete_student(student_id: int):
    return student_controller.delete_student(student_id)
