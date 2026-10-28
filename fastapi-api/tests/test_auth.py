def test_missing_token_rejected(unauthenticated_client):
    res = unauthenticated_client.get("/api/students")

    assert res.status_code == 401
    assert res.json()["success"] is False


def test_invalid_token_rejected(unauthenticated_client):
    res = unauthenticated_client.get(
        "/api/students",
        headers={"Authorization": "Bearer not-a-real-token"}
    )

    assert res.status_code == 401


def test_valid_token_allowed(client):
    res = client.get("/api/students")

    assert res.status_code == 200


def test_health_check_does_not_require_auth(unauthenticated_client):
    res = unauthenticated_client.get("/health")

    assert res.status_code == 200


def test_register_success(unauthenticated_client):
    res = unauthenticated_client.post(
        "/api/auth/register",
        json={"username": "zhangsan", "password": "secret123"}
    )

    assert res.status_code == 201
    assert res.json()["success"] is True
    assert res.json()["data"] == {"id": 1, "username": "zhangsan"}


def test_register_result_must_not_leak_password_fields(unauthenticated_client):
    res = unauthenticated_client.post(
        "/api/auth/register",
        json={"username": "zhangsan", "password": "secret123"}
    )

    assert "password" not in res.json()["data"]
    assert "password_hash" not in res.json()["data"]


def test_register_duplicate_username_rejected(unauthenticated_client):
    unauthenticated_client.post(
        "/api/auth/register",
        json={"username": "zhangsan", "password": "secret123"}
    )

    res = unauthenticated_client.post(
        "/api/auth/register",
        json={"username": "zhangsan", "password": "another456"}
    )

    assert res.status_code == 409


def test_register_short_password_rejected(unauthenticated_client):
    res = unauthenticated_client.post(
        "/api/auth/register",
        json={"username": "zhangsan", "password": "123"}
    )

    assert res.status_code == 422


def test_login_success_returns_token(unauthenticated_client):
    unauthenticated_client.post(
        "/api/auth/register",
        json={"username": "zhangsan", "password": "secret123"}
    )

    res = unauthenticated_client.post(
        "/api/auth/login",
        json={"username": "zhangsan", "password": "secret123"}
    )

    assert res.status_code == 200
    assert res.json()["success"] is True
    assert isinstance(res.json()["data"]["token"], str)
    assert res.json()["data"]["user"] == {"id": 1, "username": "zhangsan"}


def test_token_from_login_can_access_protected_api(unauthenticated_client):
    unauthenticated_client.post(
        "/api/auth/register",
        json={"username": "zhangsan", "password": "secret123"}
    )

    login_res = unauthenticated_client.post(
        "/api/auth/login",
        json={"username": "zhangsan", "password": "secret123"}
    )
    token = login_res.json()["data"]["token"]

    res = unauthenticated_client.get(
        "/api/students",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert res.status_code == 200


def test_login_wrong_password_rejected(unauthenticated_client):
    unauthenticated_client.post(
        "/api/auth/register",
        json={"username": "zhangsan", "password": "secret123"}
    )

    res = unauthenticated_client.post(
        "/api/auth/login",
        json={"username": "zhangsan", "password": "wrong-password"}
    )

    assert res.status_code == 401
    assert res.json()["message"] == "用户名或密码错误"


def test_login_unknown_username_same_error_as_wrong_password(unauthenticated_client):
    res = unauthenticated_client.post(
        "/api/auth/login",
        json={"username": "no-such-user", "password": "whatever123"}
    )

    assert res.status_code == 401
    assert res.json()["message"] == "用户名或密码错误"

