
import Router from 'koa-router'
import {disk} from './file'
import {task} from './task'
import { load } from './load'
import { EnnvServer } from '..'

export const request = (_:EnnvServer) => {
    const router = new Router()
    
    router.use('/disk',disk.routes())
    router.use('/task',task.routes())
    router.use('/load',load.routes())

    return router
}

