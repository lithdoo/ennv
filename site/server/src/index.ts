import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { EnFileDisk } from '@ennv/disk'

import { wss } from './ws/connect';
import { request } from './request/index';
import { loadList } from './request/load';
import { diskHandler } from './request/file';

export { taskManager,type EnTaskHandler } from './request/task'

export class EnnvServer {
    app = new Koa()
    constructor() {
        const router = request(this)
        this.app
            .use(bodyParser())
            .use(router.allowedMethods())
            .use(router.routes())

    }
    loadFileDisk<T>(keyName:string,fd:EnFileDisk<T>){
       diskHandler.regist(keyName,fd)
    }
    useMiddleware(middleware: Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, any>) {
        this.app.use(middleware)
    }
    setExtraFiles({ scripts, stylesheets }: {
        scripts?: string[],
        stylesheets?: string[]
    }) {
        loadList.scripts = loadList.scripts.concat(scripts ?? [])
        loadList.scripts = loadList.scripts.concat(stylesheets ?? [])
    }
    listen(port: number) {
        wss(this.app, port)
    }
}




