
from fastapi import FastAPI

from app.routers.student_router import router as student_router
from app.routers.auth_router import router as auth_router
from app.core.exceptions import ApiError, api_error_handler


# 创建 FastAPI 应用
app = FastAPI(
    title="学生管理系统 API",
    description="基于 FastAPI 的分层 CRUD 示例",
    version="1.0.0"
)


# 注册业务异常处理器
app.add_exception_handler(
    ApiError,
    api_error_handler
)


# 注册学生路由
app.include_router(student_router)

# 注册认证相关的公开路由（注册、登录）
app.include_router(auth_router)


# 健康检查接口
@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "服务运行正常"
    }
