import {type EnnvPlugin} from "@ennv/app"
import path from 'path'
import fs from 'fs'

export const gba:EnnvPlugin = {
    name:'gba-emulator',
    client:{
        staticDir:path.resolve(__dirname,'../dist/'),
        scripts:['/plugin/static/gba-emulator/ennv-plugin-gba-emulator.umd.js']
    },
    requset:(request)=>{
        console.log(request.body)
    },
    actions:[{
        key: 'gba-emulator',
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

