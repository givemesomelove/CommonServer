const { MongoClient } = require("mongodb");
const config = require("../config.js");
const myLog = require("../log.js");

class DB {
    constructor() {
        this.client = null;
        this.db = null;
        this.isConnected = false;
        this.models = {};
    }
    /// 单例模式
    static getInstance() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    }

    /// 连接数据库
    async connect() {
        if (this.isConnected) return this.db;

        try {
            myLog.wait("正在连接数据库...");

            const url = `mongodb://${config.database.host}:${config.database.port}/`
            this.client = new MongoClient(url, {});

            await this.client.connect();
            this.db = this.client.db(config.database.dbName);

            /// 验证连接
            await this.db.command({ ping: 1 });
            this.isConnected = true;
            myLog.success("数据库连接成功");

            /// 初始化模型
            await this.initModels();

            return this.db;
        } catch (error) {
            myLog.error("数据库连接失败:", error)
            /// 终止服务器项目
            process.exit(1);
        }
    }

    /// 初始化模型
    async initModels() {
        /// 用户表
        const UserDB = require("./models/userDB.js");
        this.models.User = new UserDB(this.db);

        myLog.finish("初始化数据库模型完成");
    }

    /// 断开数据库连接
    async close() {
        if (this.client) {
            await this.client.close();
            this.isConnected = false;
            myLog.stop("数据库连接已关闭");
        }
    }


}

module.exports = DB.getInstance();