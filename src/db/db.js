const { Sequelize } = require("sequelize");
const config = require("../config.js");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: process.env.DEBUG === "true" ? console.log : false,
    }
);

const models = [];
const modelsPath = path.join(__dirname, "models");

/// 加载所有模型
const Room = require("./room")(sequelize, DataTypes);
models[Room.name] = Room;

const User = require("./user")(sequelize, DataTypes);
models[User.name] = User;

const RoomPlayer = require("./roomPlayer")(sequelize, DataTypes);
models[RoomPlayer.name] = RoomPlayer;

/// 关联模型

// 房间与玩家的多对多关系
Room.belongsToMany(Player, { through: RoomPlayer, foreignKey: "roomId" });
Player.belongsToMany(Room, { through: RoomPlayer, foreignKey: "playerId" });

/// 初始化启动
const initSequelize = async () => {
    try {
        await sequelize.authenticate();
        console.log("数据库连接成功");
        await sequelize.sync({ alter: true });
        console.log("数据库同步成功");
    } catch (error) {
        console.error("数据库连接失败", error);
    }
}

module.exports = { initSequelize, models };