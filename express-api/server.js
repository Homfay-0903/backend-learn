const app = require("./src/app")

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Express 服务已启动`)
  console.log(`访问地址：http://localhost:${PORT}`)
})
