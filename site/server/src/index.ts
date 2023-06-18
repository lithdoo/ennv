export * from './lib/async';
export * from './lib/number';

import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import * as path from 'path'
import { tray } from './utils/tray'

import router from './request/index'
import bodyParser from 'koa-bodyparser'

const app = new Koa();


app.use(bodyParser())
app.use(mount('/client', serve(path.resolve(__dirname, '../node_modules/@ennv/client/dist/'))));
app.listen(4002);
app.use(router.routes())
app.use(router.allowedMethods())


try {
    tray.init()
} catch (e) {
    console.log(e)
}
console.log('listening on port 3000');
