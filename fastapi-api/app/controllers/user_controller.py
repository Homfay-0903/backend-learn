
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.services import user_service


# POST /api/auth/register
def register(data: UserCreate):
    user = user_service.register(data)

    return {
        "success": True,
        "message": "注册成功",
        "data": user
    }


# POST /api/auth/login
def login(data: UserLogin):
    token, user = user_service.login(data)

    return {
        "success": True,
        "message": "登录成功",
        "data": {"token": token, "user": user}
    }
