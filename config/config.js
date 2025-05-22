const dotenv = require('dotenv');
const path = require('path');

// 根据环境加载对应的 .env文件
const envFile = `.env.${process.env.NODE_ENV || 'developement'}`;
dotenv.config({
    path: path.resolve(__dirname, `env/${envFile}`)
});

/// 主配置对象
module.exports = {
    /// 应用配置
    app: {
        env: process.env.NODE_ENV || 'development',
        isDebug: process.env.DEBUG === 'true'
    },

    /// 服务配置
    server: {
        port: parseInt(process.env.SERVER_PORT, 10) || 3000,
        host: process.env.SERVER_HOST || 'localhost',
    },

    /// 数据库配置
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    }
}

