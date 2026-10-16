from typing import Literal, Optional

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


# 查询学生列表时，URL 查询参数应该满足的规则
class StudentQuery(BaseModel):
    page: int = Field(ge=1, default=1)
    page_size: int = Field(ge=1, le=100, default=10, alias="pageSize")
    major: Optional[str] = Field(default=None, min_length=1)
    sort_by: Literal["id", "name", "age", "major"] = Field(default="id", alias="sortBy")
    order: Literal["asc", "desc"] = "asc"

    model_config = ConfigDict(
        str_strip_whitespace=True,
        populate_by_name=True
    )


# 统一成功响应结构
class MessageResponse(BaseModel):
    success: bool
    message: str
