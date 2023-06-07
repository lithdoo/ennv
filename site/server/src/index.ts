export * from './lib/async';
export * from './lib/number';

import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import * as path from 'path'
import './utils/tray'

import router from './request/index'

const app = new Koa();

app.use(mount('/client', serve(path.resolve(__dirname, '../node_modules/@ennv/client/dist/'))));
app.listen(3000);
app.use(router.routes())
app.use(router.allowedMethods())

console.log('listening on port 3000');
