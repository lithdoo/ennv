import {type EnnvPlugin} from "@ennv/app"
import path from 'path'
import fs from 'fs'

export const json:EnnvPlugin = {
    name:'json-editor',
    client:{
        staticDir:path.resolve(__dirname,'../dist/'),
        scripts:['/plugin/static/json-editor/ennv-plugin-json-editor.umd.js']
    },
    requset:(request)=>{
        console.log(request.body)
    },
    actions:[{
        key: 'type-json',
        onPerpare(_, ctx) {
            ctx.body = {
                html: '<h1>hello world!</h1>'
            }
        },
        onStart(_, ctx) { 
           const p =  ctx.request.query.path
           if(typeof p !== 'string'){
            return
           }else{
            p.replace('/','')
            console.log(p.replace('/',''))
            ctx.response.body = fs.createReadStream(p.replace('/',''))
           }
        }
    }]
}