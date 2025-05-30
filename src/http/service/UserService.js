const db = require("../../db/db.js")
const bcrypt = require("bcrypt");

class UserService {
    constructor() {
        this.userDB = db.models.User; 
    }

    async registerUser(userData) {
        try {
            const { username, password } = req.body;
            if (!username || !password) throw new Error(`用户名或者密码不能为空`);



            // const password = await bcrypt.hash(userData.password, 10);
        } catch (error) {
            
        }
    }
}

module.exports = new UserService();