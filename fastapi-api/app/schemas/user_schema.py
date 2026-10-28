from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    # 注册时用较严的规则：用户名 3-30 个字符，密码至少 6 位
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    username: str = Field(min_length=3, max_length=30)
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    # 登录时只需要非空即可：规则是注册时定的，登录时再校验一遍长度没有意义
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    username: str = Field(min_length=1)
    password: str = Field(min_length=1)


class UserResponse(BaseModel):
    id: int
    username: str
