const jwt = require("jsonwebtoken");
const config = require("./config.js");
const User = require("./db/db.js").models.User;

const baseAuth = async (req) => {
    try {
        const token = req.headers.authorization.split(" ")[1]?.trim();

        if (!token) {
            console.error("token为空");
            throw new Error("token为空");
        }

        const decoded = jwt.verify(token, config.server.jwt);

        const user = await User.findByPk(decoded.userId);
        if (!user) throw new Error("用户不存在");

        // 将用户信息附加到请求对象
        req.user = user;
        return true;
    } catch (err) {
        return false;
    }
};

const httpAuth = async (req, res, next) => {
    const authSuccess = await baseAuth(req);
    if (authSuccess) {
        next();
    } else {
        res.status(401).json({ error: "无效token或已过期" });
    }
};

const wsAuth = async (req, socket) => {
    return await baseAuth(req);
};

const createToken = (user) => {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
    return token;
};

module.exports = {
    httpAuth,
    wsAuth,
    createToken,
};
