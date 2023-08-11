import { v2 } from 'webdav-server'
import e2k from 'express-to-koa' 
import fs from "fs"

export const createMV = async (roots: string[]) => {
    const server = new v2.WebDAVServer({
        maxRequestDepth:2
    })
    roots.forEach((path) => {
        if (!fs.existsSync(path)) return
        if (!fs.statSync(path).isDirectory()) return
        server.setFileSystemSync(path, new v2.PhysicalFileSystem(path), true)
    })
    return e2k(v2.extensions.express('/webdav/',server))
}