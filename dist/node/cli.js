"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const dev_1 = require("./dev");
const cli = (0, cac_1.default)("rpress").version("0.0.1").help();
/**
 * 创建一个npm命令
 */
cli.command("dev [root]", "start dev server").action(async (root) => {
    // root为传入的目录，没有就默认为程序当前运行命令
    const server = await (0, dev_1.createDevServer)(root);
    await server.listen();
    // 在日志内输出运行地址
    server.printUrls();
});
cli.command("build [root]", "build in production").action(async (root) => {
    console.log("dev: " + root);
});
cli.parse();
