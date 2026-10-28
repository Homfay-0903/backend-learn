import hashlib
import hmac
import os

from app.core.exceptions import ApiError

# hashlib.scrypt 要求 maxmem 至少 32MB 才允许 64 字节输出，
# 默认值不够，这里显式放宽
_SCRYPT_PARAMS = {
    "n": 16384,
    "r": 8,
    "p": 1,
    "maxmem": 64 * 1024 * 1234,
}


def hash_password(password: str) -> str:
    # 每个用户随机生成 16 字节的盐，保证同样的密码在不同用户那里算出的哈希也不同
    salt = os.urandom(16).hex()

    # scrypt 是专门为密码存储设计的慢哈希算法，dklen 是输出长度（字节）
    derived = hashlib.scrypt(
        password.encode("utf-8"),
        salt=bytes.fromhex(salt),
        dklen=64,
        **_SCRYPT_PARAMS,
    ).hex()

    # 格式为 "盐:哈希"，两部分都是十六进制字符串，存进数据库的是这一个整体字符串
    return f"{salt}:{derived}"


def verify_password(password: str, stored: str) -> bool:
    # 数据库里存的是 "盐:哈希"，先拆出当初用的盐
    salt, expected_hash = stored.split(":")

    # 用同样的盐、同样的算法对用户输入的密码再算一遍哈希
    actual_hash = hashlib.scrypt(
        password.encode("utf-8"),
        salt=bytes.fromhex(salt),
        dklen=64,
        **_SCRYPT_PARAMS,
    ).hex()

    # hmac.compare_digest 逐字节比对且耗时恒定，能防"按比对耗时猜出前几位正确"的时序攻击
    return hmac.compare_digest(actual_hash, expected_hash)
