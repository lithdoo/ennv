import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { wss } from './ws/connect';
import { request } from './request/index';
import { loadList } from './request/load';

export class EnnvServer {
    app = new Koa()
    constructor() {
        this.app
            .use(bodyParser())
            .use(request.allowedMethods())
            .use(request.routes())
    }
    use(middleware: Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, any>) {
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



