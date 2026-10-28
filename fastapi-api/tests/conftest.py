import os

# 必须在导入任何业务代码之前设置好环境变量，
# 否则 app.core.db / app.core.config 模块加载时已经读取了真实的配置
os.environ["ENV"] = "test"
# HS256 要求签名密钥至少 32 字节（RFC 7518），太短会被 PyJWT 警告
os.environ["JWT_SECRET"] = "test-jwt-secret-0123456789abcdef0123456789abcdef"

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core import db

TEST_JWT_SECRET = os.environ["JWT_SECRET"]


@pytest.fixture(autouse=True)
def reset_database():
    db.seed_defaults()


@pytest.fixture
def client():
    """登录后的客户端：自动带 Authorization: Bearer <token>，
    大部分测试只关心业务逻辑，不需要每次手动传认证头"""
    token = _login_test_user()
    return TestClient(app, headers={"Authorization": f"Bearer {token}"})


@pytest.fixture
def unauthenticated_client():
    # 专门用于测试认证失败场景，不带任何请求头
    return TestClient(app)


def _login_test_user() -> str:
    """注册并登录一个测试用户，返回 token，供其他 fixture / 测试复用"""
    test_client = TestClient(app)
    test_client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "test123456"}
    )
    res = test_client.post(
        "/api/auth/login",
        json={"username": "testuser", "password": "test123456"}
    )
    return res.json()["data"]["token"]
