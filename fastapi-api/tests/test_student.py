def test_get_all_students(client):
    res = client.get("/api/students")

    assert res.status_code == 200
    assert res.json()["success"] is True
    assert len(res.json()["data"]) == 2
    assert res.json()["data"][0]["name"] == "张三"


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
