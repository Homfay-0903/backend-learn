import jwt

from app.core.config import JWT_SECRET
from app.core.exceptions import ApiError
from app.core.password import hash_password, verify_password
from app.core.security import create_access_token
from app.models import user_model


def register(data):
    # 用户名是登录凭证，重复会导致"同一个账号两个人都能登录"，必须唯一
    if user_model.find_by_username_with_password(data.username):
        raise ApiError(409, "用户名已被占用")

    # 只把哈希值存进数据库，明文密码不落库
    user = user_model.create_user(
        username=data.username,
        password_hash=hash_password(data.password)
    )

    return user


def login(data):
    user = user_model.find_by_username_with_password(data.username)

    # 用户不存在和密码错误都返回同样的"用户名或密码错误"，
    # 如果分开提示，攻击者可以借助错误信息先枚举出哪些用户名是存在的
    if user is None or not verify_password(data.password, user["password_hash"]):
        raise ApiError(401, "用户名或密码错误")

    # 登录成功，签发 token
    # payload 里只放"被看到也无妨"的信息：用户 id、用户名、过期时间
    token = create_access_token(user["id"], user["username"])

    return token, user_model.find_by_id(user["id"])
