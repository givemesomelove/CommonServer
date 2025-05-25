const { WebSocket, WebSocketServer } = require("ws");
const { wsAuth } = require("../auth");

const initWebSockets = (server) => {

    const chatWss = new WebSocketServer({ noServer: true })
    chatWss.on('connection', (ws, req) => {
        const userInfo = `${req.user.id}:${req.user.username}`;

        console.log("聊天室 websocket连接已建立:", userInfo);

        ws.on("message", (message) => {
            console.log(`聊天室收到${userInfo}的消息：`, message.toString());
            /// 广播消息给所有客户端
            chatWss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(`聊天室消息：${message}`);
                }
            })
        });

        ws.on("close", () => {
            console.log("聊天室 websocket 连接已关闭", userInfo);
        })
    })

    const gameWss = new WebSocketServer({ noServer: true })
    gameWss.on("connection", (ws, req) => {
        const userInfo = `${req.user.id}:${req.user.username}`;
        console.log("游戏房间 websocket连接已建立:", userInfo);

        ws.on("message", (message) => {
            console.log(`游戏房间收到${userInfo}的消息：`, message.toString());
            /// 广播消息给所有客户端
            gameWss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(`游戏消息：${message}`);
                }
            })
        });

        ws.on("close", () => {
            console.log("游戏 websocket 连接已关闭", userInfo);
        })
    })

    server.on("upgrade", async (req, socket, head) => {

        /// 鉴权
        const authSuccess = await wsAuth(req, socket);
        if (!authSuccess) {
            console.error("聊天室 websocket 鉴权失败");
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }

        /// 路径匹配
        if (req.url === "/chat") {
            chatWss.handleUpgrade(req, socket, head, (ws) => {
                chatWss.emit('connection', ws, req);
            });
        } else if (url === "/game") {
            
        } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            socket.destroy();
            console.error("聊天室 websocket 路径不匹配");
        }
    })

    console.log("websocket 服务器已启动");
    return { chatWss, gameWss };
}

module.exports = initWebSockets;

