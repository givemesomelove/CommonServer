const myLog = require("../../log");

class UserDB {
    constructor(db) {
        this.collection = db.collection("users");
        this.init();
    }

    /// 初始化
    async init() {
        try {
            /// 创建用户表姓名索引
            await this.collection.createIndex({ username: 1 }, { unique: true });

            myLog.success("用户表索引创建成功");

        } catch (error) {
            myLog.error("用户表索引创建失败:", error);
        }
    }

    /// 新增用户
    async addUser(userData) {
        try {
            /// 检查用户是否存在
            const existUser = await this.collection.findOne({ username: userData.username });
            if (existUser) throw new Error("用户已存在");

            const now = new Date();
            const user = {
                username: userData.username,
                password: userData.password,
                createAt: now,
                updateAt: now
            }
            const res = await this.collection.insertOne(user);
            return res.insertedId;
        } catch (error) {
            myLog.error("创建用户失败", error);
        }
    }
}

module.exports = UserDB;