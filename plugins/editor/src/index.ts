import { type EnnvPlugin } from "@ennv/app"
import path from 'path'
import fs from 'fs'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-body'

const koa = new Koa()
const router = new Router()


router.post('save', async (ctx) => {
    const p = ctx.query.path?.toString()
    const content = ctx.request.files

    if(!content) return 

    const filePath = (p || '').replace('/', '')
    const fileContent = content.file

    if(fileContent instanceof Array) return
    

    console.log('content',content)
    console.log((content as any).file)

    const read = fs.createReadStream(fileContent.filepath)
    
    await fs.promises.writeFile(filePath,read)

    ctx.response.body = 'success'

})

koa.use(bodyParser({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024	// 设置上传文件大小最大限制，默认2M
    }
}))
koa.use(router.allowedMethods())
koa.use(router.routes())

export const gba: EnnvPlugin = {
    name: 'text-editor',
    client: {
        staticDir: path.resolve(__dirname, '../dist/'),
        scripts: ['/plugin/static/text-editor/ennv-plugin-text-editor.umd.js']
    },
    requset: koa,
    actions: [{
        key: 'text-editor',
        onPerpare(_, ctx) {
            ctx.response.body = 'success'
        },
        async onStart(_, ctx) {
            const p = ctx.request.query.path
            if (typeof p !== 'string') {
                return
            } else {
                p.replace('/', '')
                console.log(p.replace('/', ''))
                ctx.response.body = fs.createReadStream(p.replace('/', ''))
            }
        }
    }]
}

