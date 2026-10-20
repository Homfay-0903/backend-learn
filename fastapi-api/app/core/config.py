import os

from dotenv import load_dotenv

# 必须尽早加载 .env 文件，确保后面任何读取 os.environ 的代码都能拿到配置值
load_dotenv()

PORT = int(os.environ.get("PORT", 8000))
ENV = os.environ.get("ENV", "development")
DB_FILE_NAME = os.environ.get("DB_FILE_NAME", "students.db")
API_KEY = os.environ.get("API_KEY")
