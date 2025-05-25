const express = require("express");
const { createToken } = require("../../auth.js");
const { models } = require("../../db/db.js");
const bcrypt = require("bcrypt");
const { httpAuth } = require("../../auth.js");
const User = models.User;

const router = express.Router();
/// 用户注册
router.post("/register", async (req, res) => {
    try {
        /// 判空
        const { username, password } = req.body;
        if (!username || !password) throw new Error(`用户名或者密码不能为空`);

        /// 校验用户名是否存在
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) throw new Error(`用户名已存在`);

        /// 新用户入库
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

/// 用户登录
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        /// 判空
        if (!username || !password) throw new Error("用户名或密码不能为空");

        /// 校验用户名是否存在
        const user = await User.scope('withPassword').findOne({ where: { username } });
        if (!user) throw new Error("用户名不存在");

        /// 密码是否正确
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("密码错误");

        /// 生成JWT
        const token = createToken(user);
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

/// 获取用户信息
router.get("/userInfo", httpAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
})

/// 注销当前账号
router.post("/resign", httpAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        /// 删除用户
        await user.destroy();
        res.json({ message: "用户删除成功" });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
})

module.exports = router;