import {type EnnvPlugin} from "@ennv/app"
import path from 'path'

export const gba:EnnvPlugin = {
    name:'gba-emulator',
    client:{
        staticDir:path.resolve(__dirname,'../dist/'),
        scripts:['/plugin/static/gba-emulator/ennv-plugin-gba-emulator.umd.js']
    },
    // requset    
} 