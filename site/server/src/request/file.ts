import Router from 'koa-router'
// import * as fs from 'fs'
import { spawn } from 'child_process'
import * as p from 'path'
import * as fs from 'fs'
import * as hf from 'hidefile'

export const file = new Router()

const access = (path: string) => {


    if (/\$RECYCLE\.BIN$/.test(path)) {
        return false
    }
    if (/\$Recycle\.Bin$/.test(path)) {
        return false
    }

    try {
        fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK)
        return !hf.isHiddenSync(path)
    } catch (e) {
        return false
    }
}

file.get('/file/disk/list', async (ctx, next) => {
    if (process.platform.indexOf('win32') >= 0) {
        ctx.body = 'dsfs'
        ctx.body = await new Promise<string[]>((resolve, reject) => {
            const list = spawn('cmd');
            list.stdout.on('data', function (data: any) {
                const output = String(data)
                const out = output.split("\r\n").map(e => e.trim()).filter(e => e != "")
                if (out[0] === "Name") {
                    const list = out.slice(1)
                    resolve(list)
                }
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
        ctx.body = ['']
    }
    await next()
})

file.post('/file/dir/content/', async (ctx, next) => {
    const { path } = ctx.request.body as any
    const target = p.resolve(...(path ?? []))
    const res = fs.readdirSync(target, { withFileTypes: true })
        .filter(v => access(p.resolve(...(path ?? []), v.name)))
        .map((v) => ({
            name: v.name,
            isFolder: v.isDirectory(),
            isFile: v.isFile()
        }))
    ctx.body = res
    await next()
})

file.get('/file/dir/content/folders', async (ctx, next) => {
    const { path } = ctx.request.query


    let target = '/'

    if (path && (path[path.length - 1] === '/')) {
        target = path as string
    } else if (path) {
        target = path + '/'
    }

    const res = fs.readdirSync(target as string, { withFileTypes: true })
        .filter(v => v.isDirectory() && access(p.resolve(target, v.name)))
        .map((v) => ({
            name: v.name,
            isLeaf: !fs.readdirSync(p.resolve(target, v.name), { withFileTypes: true })
                .find(v2 => v2.isDirectory() && access(p.resolve(target, v.name, v2.name)))
        }))

    ctx.body = res
    await next()
})
