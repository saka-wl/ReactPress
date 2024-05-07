import cac from "cac";
import { createDevServer } from "./dev";

const cli = cac("rpress").version("0.0.1").help()

/**
 * 创建一个npm命令
 */
cli.command("dev [root]", "start dev server").action(async (root: string) => {
    // root为传入的目录，没有就默认为程序当前运行命令
    const server = await createDevServer(root)
    await server.listen()
    // 在日志内输出运行地址
    server.printUrls()
    // console.log("dev: " + root)
})

cli.command("build [root]", "build in production").action(async (root: string) => {
    console.log("dev: " + root)
})

cli.parse()