#!/usr/bin/env node
import path from 'path'
import fs from 'fs'
import { EnnvAppServer } from './index'

const configPath = path.resolve(process.cwd(), './ennv.config.cjs')

if (!fs.existsSync(configPath)) {
    new EnnvAppServer({}).listen()
} else {
    import(configPath).then(config => {
        new EnnvAppServer(config).listen()
        console.log(config)
    })
}