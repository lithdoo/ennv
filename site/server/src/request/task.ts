import { ParameterizedContext } from 'koa'
import Router from 'koa-router'


export const task = new Router()


task.get('/prepare/:taskKey', async (ctx, next) => {
    const path: string = ctx.query.path as string || ''
    const key: string = ctx.params.taskKey
    await taskManager.prepare(key, { path, ctx })
    await next()
})

task.get('/start/:taskKey', async (ctx, next) => {
    const path: string = ctx.query.path as string || ''
    const taskId: string = ctx.query.id as string || ''
    const key: string = ctx.params.taskKey
    await taskManager.start(key, { path, taskId, ctx })
    await next()
})

type RequstCtx = ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>


export const taskManager = new class EnTaskManager {
    all: Map<string, EnTaskHandle> = new Map()

    regist(handle: EnTaskHandle) {
        if (this.all.has(handle.key)) throw new Error('handle has been regist or task-key has been used.')
        this.all.set(handle.key, handle)
    }

    async prepare(key: string, { path, ctx }: { path: string, ctx: RequstCtx }) {
        const handle = this.all.get(key)
        if (!handle) throw new Error(`handle named "${key}" is not found.`)
        const taskId = Math.random().toString().replace('.', '')
        await handle.onPerpare({ taskId, path }, ctx)
        ctx.set('ennv-task-id', taskId)
    }

    async start(key: string, { path, taskId, ctx }: { path: string, taskId: string, ctx: RequstCtx }) {
        const handle = this.all.get(key)
        if (!handle) throw new Error(`handle named "${key}" is not found.`)
        await handle.onStart({ taskId, path }, ctx)
    }
}


interface EnTaskHandle {
    key: string

    onPerpare: (option: {
        taskId: string,
        path: string,
    }, ctx: RequstCtx) => unknown

    onStart: (option: {
        taskId: string,
        path: string
    }, ctx: RequstCtx) => unknown

}


taskManager.regist({
    key: 'hello',
    onPerpare(_, ctx) {
        ctx.body = {
            html: '<h1>hello world!</h1>'
        }
    },
    onStart(_, ctx) { ctx.body = 'test' }
})