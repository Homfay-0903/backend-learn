def test_missing_api_key_rejected(unauthenticated_client):
    res = unauthenticated_client.get("/api/students")

    assert res.status_code == 401
    assert res.json()["success"] is False


def test_wrong_api_key_rejected(unauthenticated_client):
    res = unauthenticated_client.get(
        "/api/students",
        headers={"x-api-key": "wrong-key"}
    )

    assert res.status_code == 401


def test_correct_api_key_allowed(client):
    res = client.get("/api/students")

    assert res.status_code == 200


def test_health_check_does_not_require_api_key(unauthenticated_client):
    res = unauthenticated_client.get("/health")

    assert res.status_code == 200


def test_get_all_students(client):
    res = client.get("/api/students")

    assert res.status_code == 200
    assert res.json()["success"] is True
    assert len(res.json()["data"]) == 2
    assert res.json()["data"][0]["name"] == "张三"
    assert res.json()["pagination"] == {
        "page": 1,
        "pageSize": 10,
        "total": 2,
        "totalPages": 1
    }


def test_get_all_students_page_size_limits_results(client):
    res = client.get("/api/students?pageSize=1")

    assert res.status_code == 200
    assert len(res.json()["data"]) == 1
    assert res.json()["pagination"]["totalPages"] == 2


def test_get_all_students_filter_by_major(client):
    res = client.get("/api/students?major=软件工程")

    assert res.status_code == 200
    assert len(res.json()["data"]) == 1
    assert res.json()["data"][0]["name"] == "李四"


def test_get_all_students_sort_by_age_desc(client):
    res = client.get("/api/students?sortBy=age&order=desc")

    assert res.status_code == 200
    assert res.json()["data"][0]["name"] == "李四"
    assert res.json()["data"][1]["name"] == "张三"


def test_get_all_students_invalid_sort_by_rejected(client):
    res = client.get("/api/students?sortBy=password")

    assert res.status_code == 422


def test_get_student_by_id_found(client):
    res = client.get("/api/students/1")

    assert res.status_code == 200
    assert res.json()["data"]["name"] == "张三"


def test_get_student_by_id_not_found(client):
    res = client.get("/api/students/999")

    assert res.status_code == 404
    assert res.json()["success"] is False


def test_create_student_success(client):
    res = client.post(
        "/api/students",
        json={"name": "王五", "age": 22, "major": "物理"}
    )

    assert res.status_code == 201
    assert res.json()["data"]["id"] == 3
    assert res.json()["data"]["name"] == "王五"


def test_create_student_age_out_of_range(client):
    res = client.post(
        "/api/students",
        json={"name": "王五", "age": 200, "major": "物理"}
    )

    assert res.status_code == 422


def test_create_student_wrong_type(client):
    res = client.post(
        "/api/students",
        json={"name": 123, "age": 20, "major": "物理"}
    )

    assert res.status_code == 422


def test_create_student_extra_field_rejected(client):
    res = client.post(
        "/api/students",
        json={"name": "王五", "age": 20, "major": "物理", "password": "123456"}
    )

    assert res.status_code == 422


def test_update_student_success(client):
    res = client.put(
        "/api/students/1",
        json={"name": "张三三", "age": 21, "major": "计算机科学"}
    )

    assert res.status_code == 200
    assert res.json()["data"]["name"] == "张三三"


def test_update_student_not_found(client):
    res = client.put(
        "/api/students/999",
        json={"name": "张三三", "age": 21, "major": "计算机科学"}
    )

    assert res.status_code == 404


def test_delete_student_success(client):
    delete_res = client.delete("/api/students/1")
    assert delete_res.status_code == 200

    get_res = client.get("/api/students/1")
    assert get_res.status_code == 404


def test_delete_student_not_found(client):
    res = client.delete("/api/students/999")

    assert res.status_code == 404
