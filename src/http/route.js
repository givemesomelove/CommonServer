const fs = require("fs");
const path = require("path");

const initRoutes = (app) => {
    const routesPath = path.join(__dirname, "routes");
    fs.readdirSync(routesPath)
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
            const route = require(path.join(routesPath, file));
            if (!route) {
                console.error(`路由文件 ${file} 格式不正确`);
                return;
            }

            const routePath = file.replace(".js", "");
            app.use(`/${routePath}`, require(`./routes/${routePath}`));
            console.log(`加载路由: ${route.path}`);
        });
};

module.exports = { initRoutes };
