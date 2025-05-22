const express = require('express');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();

const server = http.createServer(app);

// 统一启用 CORS，允许所有来源访问
app.use(cors());

// 静态文件服务（放在路由配置前）
app.use(express.static('public'));

// 手动配置根路径路由，指向 index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

/// http 服务
app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: Date.now(),
        wsConnetions: wss.clients.size
    })
})

/// WebSocket 服务
const wss = new WebSocket.Server({server});
wss.on('connection', (ws) => {
    console.log('客户端连接成功!', ws);

    ws.on('message', (message) => {
        console.log('接收到客户端消息:', message.toString());
        ws.send('服务器接收到消息:' );
    })

    ws.on('close', () => {
        console.log('客户端断开连接!');
    })
})

/// 自动服务
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`服务端启动成功，端口号为:${PORT}`);
})

// 错误处理（可选）
server.on('error', (err) => {
  if (err.code === 'EACCES' && PORT < 1024) {
    console.error('⚠️ 需要管理员权限才能使用 1024 以下端口');
  }
});
