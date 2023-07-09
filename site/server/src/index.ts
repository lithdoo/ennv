export * from './lib/async';
export * from './lib/number';

import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import * as path from 'path'
import { tray } from './utils/tray'

import bodyParser from 'koa-bodyparser'

import { wss } from './request/connect';
import { file } from './request/file';


const app = new Koa();

app.use(bodyParser())
app.use(mount('/client', serve(path.resolve(__dirname, '../node_modules/@ennv/client/dist/'))));


;(app)
    .use(file.routes())
    .use(file.allowedMethods())

wss(app,4002)

try {
    tray.init()
} catch (e) {
    console.log(e)
}



console.log('listening on port 3000');
