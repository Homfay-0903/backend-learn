import os

# 必须在导入任何业务代码之前设置好环境变量，
# 否则 app.core.db / app.core.config 模块加载时已经读取了真实的配置
os.environ["ENV"] = "test"
os.environ["API_KEY"] = "test-api-key"

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core import db

TEST_API_KEY = os.environ["API_KEY"]


@pytest.fixture(autouse=True)
def reset_database():
    db.seed_defaults()


@pytest.fixture
def client():
    # 默认带上测试用的 API Key，大部分测试只关心业务逻辑，不需要每次手动传认证头
    return TestClient(app, headers={"x-api-key": TEST_API_KEY})


@pytest.fixture
def unauthenticated_client():
    # 专门用于测试认证失败场景，不带任何请求头
    return TestClient(app)
