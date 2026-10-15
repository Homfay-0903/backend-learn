import os

# 必须在导入任何业务代码之前设置好环境变量，
# 否则 app.core.db 模块加载时已经连上了真实的 students.db 文件
os.environ["ENV"] = "test"

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core import db


@pytest.fixture(autouse=True)
def reset_database():
    db.seed_defaults()


@pytest.fixture
def client():
    return TestClient(app)
