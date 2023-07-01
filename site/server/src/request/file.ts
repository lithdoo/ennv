import Router from 'koa-router'
// import * as fs from 'fs'
import { spawn } from 'child_process'
import { resolve, posix } from 'path'
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
        if(hf.isHiddenSync(path)) return false 
    } catch (e) {
        return false
    }
    
    if(fs.statSync(path).isFile()){
        return true
    }

    if(fs.statSync(path).isDirectory()){
        return true
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

file.get('/file/dir/content', async (ctx, next) => {
    const { path } = ctx.request.query
    let target = '/'

    if (path && (path[path.length - 1] === '/')) {
        target = path as string
    } else if (path) {
        target = path + '/'
    }

    const res = fs.readdirSync(target, { withFileTypes: true })
        .filter(v => resolve(target, v.name))
        .map((v) => ({
            name: v.name,
            path: posix.join(target, v.name),
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
        .filter(v => v.isDirectory() && access(resolve(target, v.name)))
        .map((v) => ({
            name: v.name,
            isLeaf: !fs.readdirSync(resolve(target, v.name), { withFileTypes: true })
                .find(v2 => v2.isDirectory() && access(resolve(target, v.name, v2.name)))
        }))

    ctx.body = res
    await next()
})

file.get('/file/detail', async (ctx, next) => {

    const { path } = ctx.request.query

    const target = resolve((path as string) ?? '')

    if (!access(target)) throw new Error('error path')

    const stat = fs.statSync(target)

    if (!stat.isFile()) throw new Error('not file path')

    ctx.body = {
        updateTime: stat.mtimeMs,
        createTime: stat.ctimeMs,
        size: stat.size
    }

    await next()
})

file.get('/file/folder/detail', async (ctx, next) => {

    const { path } = ctx.request.query

    const target = resolve((path as string) ?? '')

    if (!access(target)) throw new Error('error path')

    const stat = fs.statSync(target)

    if (!stat.isDirectory()) throw new Error('not folder path')

    ctx.body = {
        updateTime: stat.mtimeMs,
        createTime: stat.ctimeMs,
    }

    await next()
})