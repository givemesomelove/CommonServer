const bcrypt = require("bcrypt");
const crypto = require("crypto");

const defineModel = (sequelize, dataTypes) => {
    const Room = sequelize.define(
        "Room",
        {
            roomname: {
                type: dataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: dataTypes.STRING,
                allowNull: true,
            },
            gameType: {
                type: dataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1, // 默认游戏类型
            },
            needPlayers: {
                type: dataTypes.INTEGER,
                allowNull: false,
                defaultValue: 4, // 默认需要的玩家数量
            },
            status: {
                type: dataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0, // 默认房间状态
            },
            owenerId: {
                type: dataTypes.INTEGER,
                allowNull: false, // 房主是必填项
            }
        },
        {
            defaultScope: {
                // 默认查询时
                attributes: { exclude: ["password"] },
            },
            scopes: {
                withPassword: {
                    attributes: {},
                },
            },
        }
    );

    const generateRoomName = () => {
        return crypto.randomBytes(8).toString("hex");
    };

    Room.beforeCreate(async (room) => {
        if (!room.roomname) {
            room.name = generateRoomName();
        }

        let isUnique = false;
        let retries = 0;
        while (!isUnique && retries < 5) {
            const existingRoom = await Room.findOne({
                where: { name: room.name },
            });

            if (!existingRoom) {
                isUnique = true;
            } else {
                room.name = generateRoomName();
                retries++;
            }
        }

        if (!isUnique) {
            throw new Error("无法生成唯一房间名，请重试");
        }

        if (room.password) {
            room.password = await bcrypt.hash(room.password, 10);
        }
    });

    return User;
};

module.exports = defineModel;
