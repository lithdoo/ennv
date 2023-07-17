
import Router from 'koa-router'
import {file} from './file'
import {task} from './task'

export const request = new Router()

request.use('/file',file.routes())
request.use('/task',task.routes())