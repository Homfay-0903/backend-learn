import os

from dotenv import load_dotenv

# 必须尽早加载 .env 文件，确保后面任何读取 os.environ 的代码都能拿到配置值
load_dotenv()

PORT = int(os.environ.get("PORT", 8000))
ENV = os.environ.get("ENV", "development")
DB_FILE_NAME = os.environ.get("DB_FILE_NAME", "students.db")
# JWT 的签名密钥：没有默认值，缺失时认证依赖会直接拒绝所有请求（fail-closed）
JWT_SECRET = os.environ.get("JWT_SECRET")
JWT_EXPIRES_IN = int(os.environ.get("JWT_EXPIRES_IN", 3600))  # 单位秒，1h = 3600
