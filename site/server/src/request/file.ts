import Router from 'koa-router'
// import * as fs from 'fs'
import { spawn } from 'child_process'
import * as p from 'path'
import * as fs from 'fs'

export const file = new Router()

file.get('/file/root', async (ctx, next) => {
    if (process.platform.indexOf('win32') >= 0) {
        ctx.body = 'dsfs'
        ctx.body = await new Promise<string[]>((resolve, reject) => {
            const list = spawn('cmd');
            list.stdout.on('data', function (data: any) {
                const output = String(data)
                const out = output.split("\r\n").map(e => e.trim()).filter(e => e != "")
                if (out[0] === "Name") { resolve(out.slice(1)) }
            });

            list.stderr.on('data', function (data: any) {
                console.log('stderr: ' + data);
            });

            list.on('exit', function (code: any) {
                if (code !== 0) { reject(code) }
            });

            list.stdin.write('wmic logicaldisk get name\n');
            list.stdin.end();
        })
    } else {
        ctx.body = ['/']
    }
    await next()
})

file.get('/list', async (ctx, next) => {

    const { root, path } = ctx.query
    const target = p.resolve(root as string, path as string)
    const res = fs.readdirSync(target, { withFileTypes: true }).map((v) => ({
        name: v.name,
        isDir: v.isDirectory(),
        isFile: v.isFile()
    }))
    ctx.body = res

    await next()
})
