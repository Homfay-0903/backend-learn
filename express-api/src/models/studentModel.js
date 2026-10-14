let students = [
    {
        id: 1,
        name: "张三",
        age: 20,
        major: "计算机科学"
    },
    {
        id: 2,
        name: "李四",
        age: 21,
        major: "软件工程"
    }
]

let nextId = 3

//获取全部学生
function getAllStudents() {
    return students
}

//根据id获取学生
function getStudentById(id) {
    return students.find(student => student.id === id)
}

//添加学生
function addStudent(data) {
    const student = {
        id: nextId++,
        ...data
    }

    students.push(student)
    return student
}

//更新学生
function updateStudent(id, data) {
    const index = students.findIndex(student => student.id === id)

    if (index === -1) {
        return null
    }

    students[index] = {
        ...students[index],
        ...data
    }

    return students[index]
}

//删除学生
function deleteStudent(id) {
    const index = students.findIndex(student => student.id === id)

    if (index === -1) {
        return null
    }

    const deletedStudent = students[index]
    students.splice(index, 1)
    return deletedStudent
}

module.exports = {
    getAllStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent
}