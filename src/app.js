const config = require("./config.js");
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");

const { initSequelize } = require("./db/db.js");
const { initRoutes } = require("./http/route.js");
const initWebSockets = require("./websocket/websocket.js");

/// 初始化数据库
initSequelize();

const app = express();

/// 压缩
app.use(compression());
/// 跨域
app.use(cors());
/// 日志
app.use(morgan("dev"));
/// 静态文件路径
app.use(express.static("public"));
/// 解析json
app.use(express.json());
/// 解析urlencoded
// app.use(express.urlencoded({ extended: true }));

/// 路由初始化
initRoutes(app);
/// websocket初始化
const server = http.createServer(app);
initWebSockets(server);

/// 全局错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "服务器错误" });
});

server.listen(config.server.port, "0.0.0.0", () => {
    console.log(`服务器正在运行在 http://localhost:${config.server.port}`);
});
