
import Router from 'koa-router'

export const load = new Router()

export const loadList = {
    scripts: [] as string[],
    stylesheets: [] as string[]
}

load.get('/script/list', async (ctx, next) => {
    ctx.body = loadList.scripts
    return await next()
})

load.get('/stylesheet/list', async (ctx, next) => {
    ctx.body = loadList.stylesheets
    return await next()
})