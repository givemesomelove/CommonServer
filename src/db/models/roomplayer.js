const bcrypt = require("bcrypt");

const defineModel = (sequelize, dataTypes) => {
    const roomPlayer = sequelize.define("RoomPlayer", {
        roomId: {
            type: dataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Room",
                key: "id",
            },
        },
        userId: {
            type: dataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User",
                key: "id",
            },
        },
        ready: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true, // 默认玩家状态
        },
        seatOrder: {
            type: dataTypes.INTEGER,
            allowNull: false,
        }
    });

    return roomPlayer;
}

module.exports = defineModel;