import Router from 'koa-router'
import serve from 'koa-static'
import { EnTaskHandler, EnnvServer, taskManager } from "@ennv/server"
import { EnFileDisk } from '@ennv/disk'
import mount from 'koa-mount'
import { tray } from './tray'
import * as path from 'path'
import Koa from 'koa'

export { LocalFile } from './file'

export interface EnnvConfig {
    port: number
    disk: { [keyName: string]: EnFileDisk<unknown> }
    plugins: EnnvPlugin[]
}

export interface EnnvPlugin {
    name: string
    requset?: Koa<Koa.DefaultState, Koa.DefaultContext>
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
        disk: {},
        plugins: [],
    }
}

export class EnnvAppServer {
    private config: EnnvConfig
    private server: EnnvServer
    constructor(config: Partial<EnnvConfig>) {
        this.config = Object.assign(getDefaultConfig(), config)
        this.server = new EnnvServer()

        this.initDisk()
        this.initClient()
        this.initPluginAction()
        this.initPluginClient()
        this.initPluginRequest()

        try { tray.init() }
        catch (e) { console.log(e) }
    }
    initClient() {
        this.server.useMiddleware(mount('/client', serve(path.resolve(__dirname, '../node_modules/@ennv/client/dist/'))))
    }
    initDisk() {
        Array.from(Object.entries(this.config.disk)).forEach(([keyName, fileDisk]) => {
            this.server.loadFileDisk(keyName, fileDisk)
        })
    }
    initPluginRequest() {
        const router = new Router()
        this.config.plugins.filter(v => v.name).forEach(v => {
            if (!v.requset) return

            this.server.useMiddleware(mount(`/plugin/requset/${v.name}/`, v.requset))
        })
        this.server.useMiddleware(router.allowedMethods() as any)
        this.server.useMiddleware(router.routes() as any)

    }
    initPluginClient() {
        this.config.plugins.forEach(plugin => {
            if (!plugin.client?.staticDir) return
            this.server.useMiddleware(mount(`/plugin/static/${plugin.name}`, serve(plugin.client.staticDir)))
        })
        this.server.setExtraFiles(this.config.plugins.reduce((res, current) => ({
            scripts: res.scripts.concat(current.client?.scripts || []),
            stylesheets: res.scripts.concat(current.client?.stylesheets || []),
        }), { scripts: [] as string[], stylesheets: [] as string[] }))
    }
    initPluginAction() {
        this.config.plugins.forEach(plugin => {
            if (!plugin.actions) return
            plugin.actions.forEach(hander => {
                taskManager.regist(hander)
            })
        })
    }
    listen() {
        this.server.listen(this.config.port)
    }
}




