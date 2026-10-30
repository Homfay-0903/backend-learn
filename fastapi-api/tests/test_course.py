def test_get_courses_of_student(client):
    res = client.get("/api/students/1/courses")

    assert res.status_code == 200
    assert res.json()["data"] == [
        {"id": 1, "name": "高等数学", "studentId": 1},
        {"id": 2, "name": "大学英语", "studentId": 1}
    ]


def test_get_courses_of_missing_student(client):
    res = client.get("/api/students/999/courses")

    assert res.status_code == 404


def test_get_courses_of_student_without_courses(client):
    create_res = client.post(
        "/api/students",
        json={"name": "王五", "age": 22, "major": "物理"}
    )
    student_id = create_res.json()["data"]["id"]

    res = client.get(f"/api/students/{student_id}/courses")

    assert res.status_code == 200
    assert res.json()["data"] == []


def test_create_course(client):
    res = client.post(
        "/api/students/1/courses",
        json={"name": "线性代数"}
    )

    assert res.status_code == 201
    assert res.json()["data"] == {"id": 4, "name": "线性代数", "studentId": 1}


def test_create_course_student_id_in_body_rejected(client):
    # student_id 只能来自 URL，请求体伪造归属关系应被 extra="forbid" 拦下
    res = client.post(
        "/api/students/1/courses",
        json={"name": "线性代数", "studentId": 2}
    )

    assert res.status_code == 422


def test_create_course_empty_name_rejected(client):
    res = client.post(
        "/api/students/1/courses",
        json={"name": "  "}
    )

    assert res.status_code == 422


def test_update_course(client):
    res = client.put(
        "/api/students/1/courses/1",
        json={"name": "高等数学(下)"}
    )

    assert res.status_code == 200
    assert res.json()["data"]["name"] == "高等数学(下)"


def test_update_course_of_other_student_rejected(client):
    # 课程 3 属于学生 2，拿学生 1 的路径去改应该查无此课
    res = client.put(
        "/api/students/1/courses/3",
        json={"name": "越权修改"}
    )

    assert res.status_code == 404


def test_update_missing_course(client):
    res = client.put(
        "/api/students/1/courses/999",
        json={"name": "不存在的课"}
    )

    assert res.status_code == 404


def test_delete_course(client):
    delete_res = client.delete("/api/students/1/courses/1")
    assert delete_res.status_code == 200

    list_res = client.get("/api/students/1/courses")
    assert len(list_res.json()["data"]) == 1


def test_delete_course_of_other_student_rejected(client):
    res = client.delete("/api/students/1/courses/3")

    assert res.status_code == 404


def test_cascade_delete(client):
    client.delete("/api/students/1")

    # 学生没了，课程路由返回 404；级联删除后课程记录也一并清空
    res = client.get("/api/students/1/courses")
    assert res.status_code == 404


def test_student_detail_includes_courses(client):
    # 学生详情用 LEFT JOIN 聚合，附带课程列表
    res = client.get("/api/students/1")

    assert res.status_code == 200
    assert res.json()["data"]["name"] == "张三"
    assert res.json()["data"]["courses"] == [
        {"id": 1, "name": "高等数学"},
        {"id": 2, "name": "大学英语"}
    ]
