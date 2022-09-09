const jsonServer = require('json-server')
const auth = require('json-server-auth')
const server = jsonServer.create()
const router = jsonServer.router('db.json')//chổ này nếu bạn đăt tên file json khác thì sửa ở đây
const middlewares = jsonServer.defaults()

server.db = router.db

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
server.use(auth)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now()//chổ này là tự động tạo ngày tạo đối với phương thức post
        req.body.updateAt = Date.now()// chổ này tự động tạo ngày update vào đối tượng khi có sự thay đổi
    }
    // Continue to JSON Server router
    next()
})

// Use default router
server.use("/api/auth", auth) // chổ này là cấu hình đường dẫn cho phần auth vd đường dẫn base là http://localhost:3001/     
//thì đường dẫn vào trang đăng kí sẽ là http://localhost:3001/api/auth/resgister
server.use("/api", router)// chổ này là cấu hình đường dẫn vào api chính 
server.listen(process.env.PORT || 3553, () => {// nếu muốn thay đổi cổng lắng nghe thì đổi ở đây mặc định mình để 3003 để tránh trùng với reactjs 
    console.log('JSON Server is running on port 3553')
})
