
from fastapi import APIRouter

from app.controllers import user_controller
from app.schemas.user_schema import UserCreate, UserLogin

# 注册和登录本身当然是公开接口：还没登录的人才有必要访问它们
router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", status_code=201)
def register(data: UserCreate):
    return user_controller.register(data)


@router.post("/login")
def login(data: UserLogin):
    return user_controller.login(data)
