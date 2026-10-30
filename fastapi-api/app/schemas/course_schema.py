from pydantic import BaseModel, ConfigDict, Field


class CourseCreate(BaseModel):
    # 课程只需要一个名字；student_id 来自 URL 路径参数，不来自请求体，
    # 所以模型里不定义它——这能防止请求体伪造归属关系
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    name: str = Field(min_length=1, max_length=50)


class CourseResponse(BaseModel):
    id: int
    name: str
    studentId: int
