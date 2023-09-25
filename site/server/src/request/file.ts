import Router from 'koa-router'
import { EnFileDisk } from '@ennv/disk'

export const disk = new Router()

disk.get('/dir/content/:key', async (ctx) => {
    const key = ctx.params.key
    const path = ctx.query.path?.toString() || '/'
    ctx.body = await diskHandler.getDirContent(key, path)
})

disk.get('/file/:key', async (ctx) => {
    const key = ctx.params.key
    const path = ctx.query.path?.toString() || '/'
    ctx.body = await diskHandler.getFile(key, path)
})


disk.get('/list', async (ctx) => {
    ctx.body = diskHandler.getKeyNameList()
})

export const diskHandler = new class FileHandler {
    fileDisks: Map<string, EnFileDisk<unknown>> = new Map()

    regist<T>(keyName:string,fd: EnFileDisk<T>) {
        if (this.fileDisks.has(keyName)) {
            throw new Error(`Disk named "${keyName}" has been loaded!`)
        } else {
            this.fileDisks.set(keyName, fd)
        }
    }

    getFile(key: string, path: string) {
        const disk = this.fileDisks.get(key)
        if (!disk) throw new Error(`disk named "${key}" is not found!`)
        return disk.getFile(path)
    }

    getDirContent(key: string, path: string) {
        const disk = this.fileDisks.get(key)
        if (!disk) throw new Error(`disk named "${key}" is not found!`)
        return disk.getDirContent(path)

    }

    getKeyNameList() {
        return Array.from(this.fileDisks.keys())
    }
}