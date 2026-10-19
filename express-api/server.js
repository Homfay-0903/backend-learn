const app = require("./src/app")
const env = require("./src/config/env")

app.listen(env.port, () => {
  console.log(`Express 服务已启动`)
  console.log(`访问地址：http://localhost:${env.port}`)
})
