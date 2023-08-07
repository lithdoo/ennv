#!/usr/bin/env node
import path from 'path'
import fs from 'fs'
import { EnnvAppServer } from './index'

const configPath = path.resolve(process.cwd(), './ennv.config.cjs')

if (!fs.existsSync(configPath)) {
    new EnnvAppServer({}).listen()
} else {
    // const config = require(configPath)
    // new EnnvAppServer(config).listen()
    import(configPath).then(config => {
        new EnnvAppServer(config).listen()
        console.log(config)
    })


}