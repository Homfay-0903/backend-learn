from fastapi import Depends
from fastapi.security import APIKeyHeader

from app.core.config import API_KEY
from app.core.exceptions import ApiError

# 声明期望从哪个请求头读取密钥，auto_error=False 让我们自己控制缺失时的错误信息
api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)


def verify_api_key(provided_key: str = Depends(api_key_header)):
    # 服务端自己都没配置密钥，说明部署配置有问题，不应该放行任何请求
    if not API_KEY:
        raise ApiError(500, "服务端未配置 API_KEY")

    if not provided_key:
        raise ApiError(401, "缺少 x-api-key 请求头")

    if provided_key != API_KEY:
        raise ApiError(401, "API Key 无效")
