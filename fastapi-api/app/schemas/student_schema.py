from pydantic import BaseModel, Field, ConfigDict


# 新增和修改学生时提交的数据
class StudentCreate(BaseModel):
    name: str = Field(min_length=1)
    age: int = Field(ge=1, le=150, strict=True)
    major: str = Field(min_length=1)

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )


# 返回给客户端的学生数据
class StudentResponse(StudentCreate):
    id: int


# 统一成功响应结构
class MessageResponse(BaseModel):
    success: bool
    message: str
