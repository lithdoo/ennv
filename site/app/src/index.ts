import Router from 'koa-router'
import serve from 'koa-static'
import { EnTaskHandler, EnnvServer, taskManager } from "@ennv/server"
import mount from 'koa-mount'
import { tray } from './tray'
import * as path from 'path'
import { createMV } from './webdav'

export interface EnnvConfig {
    port: number
    roots: string[],
    plugins: EnnvPlugin[]
}

export interface EnnvPlugin {
    name: string
    requset?: Router.IMiddleware<any, {}>
    client?: {
        scripts?: string[],
        stylesheets?: string[],
        staticDir?: string,
    },
    actions?: EnTaskHandler[]
}

export const getDefaultConfig: () => EnnvConfig = () => {
    return {
        port: 4008,
        roots: ['C:'],
        plugins: [],
    }
}

export class EnnvAppServer {
    private config: EnnvConfig
    private server: EnnvServer
    constructor(config: Partial<EnnvConfig>) {
        this.config = Object.assign(getDefaultConfig(), config)
        this.server = new EnnvServer()

        this.initClient()
        this.initWebDav()
        this.initPluginAction()
        this.initPluginClient()
        this.initPluginRequest()

        try { tray.init() }
        catch (e) { console.log(e) }
    }
    initClient() {
        this.server.use(mount('/client', serve(path.resolve(__dirname, '../node_modules/@ennv/client/dist/'))))
    }
    async initWebDav() {
        this.server.use(await createMV(this.config.roots))
    }
    initPluginRequest() {
        const router = new Router()
        this.config.plugins.filter(v => v.name).forEach(v => {
            if (!v.requset) return
            router.use(`/plugin/requset/${v.name}`, v.requset)
        })
        this.server.use(router.allowedMethods() as any)
        this.server.use(router.routes() as any)
    }
    initPluginClient() {
        this.config.plugins.forEach(plugin => {
            if (!plugin.client?.staticDir) return
            this.server.use(mount(`/plugin/static/${plugin.name}`, serve(plugin.client.staticDir)))
        })
        this.server.setExtraFiles(this.config.plugins.reduce((res, current) => ({
            scripts: res.scripts.concat(current.client?.scripts || []),
            stylesheets: res.scripts.concat(current.client?.stylesheets || []),
        }), { scripts: [] as string[], stylesheets: [] as string[] }))
    }
    initPluginAction() {
        this.config.plugins.forEach(plugin => {
            if (!plugin.actions) return
            plugin.actions.forEach(hander=>{
                taskManager.regist(hander)
            })
        })
    }
    listen() {
        this.server.listen(this.config.port)
    }
}



