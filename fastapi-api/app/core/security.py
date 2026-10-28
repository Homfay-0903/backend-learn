from datetime import datetime, timedelta, timezone

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

import jwt

from app.core.config import JWT_SECRET, JWT_EXPIRES_IN
from app.core.exceptions import ApiError

# 声明 token 从 Authorization: Bearer <token> 请求头读取，auto_error=False 让我们自己控制错误信息
# tokenUrl 会让 Swagger 文档页的 Authorize 按钮知道去哪个接口换取 token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def create_access_token(user_id: int, username: str) -> str:
    if not JWT_SECRET:
        # 服务端没配置签名密钥，说明部署配置有问题，不应该签发任何 token
        raise ApiError(500, "服务端未配置 JWT_SECRET")

    payload = {
        # sub 是 JWT 标准声明，表示"这个 token 的主体是谁"
        "sub": str(user_id),
        "username": username,
        # exp 是 JWT 标准声明，PyJWT 验证时会自动检查是否过期
        "exp": datetime.now(timezone.utc) + timedelta(seconds=JWT_EXPIRES_IN),
    }

    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def verify_jwt(token: str = Depends(oauth2_scheme)):
    # 服务端没配置签名密钥，说明部署配置有问题，不应该放行任何请求
    if not JWT_SECRET:
        raise ApiError(500, "服务端未配置 JWT_SECRET")

    if not token:
        raise ApiError(401, "缺少 Authorization: Bearer <token> 请求头")

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
        )
    except jwt.ExpiredSignatureError:
        raise ApiError(401, "token 已过期，请重新登录")
    except jwt.InvalidTokenError:
        raise ApiError(401, "token 无效")

    # 把"当前登录用户是谁"作为依赖的返回值，后续依赖链和路由函数都能拿到
    return {"id": payload["sub"], "username": payload["username"]}
