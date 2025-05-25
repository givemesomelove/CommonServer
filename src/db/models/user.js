const bcrypt = require("bcrypt");

const defineModel = (sequelize, dataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: dataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        avatar: dataTypes.INTEGER,
    }, {
        defaultScope: {
            // 默认查询时
            attributes: { exclude: ["password"] }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
        }
    });

    User.beforeCreate(async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
    });

    return User;
}

module.exports = defineModel;