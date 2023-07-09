import Router from "koa-router";
import { WebSocket, WebSocketServer } from 'ws'
import { pathToRegexp } from 'path-to-regexp'
import http from 'http'
import Koa from 'koa'
import url from 'url'

export class WsConnext {
    static all: Map<string, WsConnext> = new Map()
    static cache: Map<string, { timeout: NodeJS.Timeout, messages: string[] }> = new Map()
    static send(id: string, message: string) {
        const wc = WsConnext.all.get(id)
        if (wc) return wc.send(message)
        const cache = WsConnext.cache.get(id)
        if (cache) cache.messages.push(message)


        const timeout = setTimeout(() => {
            const cache = WsConnext.cache.get(id)
            if (cache && cache.timeout === timeout) {
                WsConnext.cache.delete(id)
            }
        }, 1000 * 60 * 10)
        const messages = [message]
        this.cache.set(id, {
            timeout, messages,
        })
    }

    connextId: string
    ws: WebSocket

    constructor(id: string, ws: WebSocket) {
        this.connextId = id
        this.ws = ws
        this.ws.on('ping', () => {this.ws.pong()})
        this.ws.on('open', () => { this.regist() })
        this.ws.on('close', () => { this.destroy() })
        if (this.ws.readyState === this.ws.OPEN) {
            this.regist()
        }
    }

    regist() {
        if (WsConnext.all.has(this.connextId)) return
        WsConnext.all.set(this.connextId, this)
        const cache = WsConnext.cache.get(this.connextId)
        if (cache) cache.messages.forEach(msg => this.send(msg))
        this.ping()
    }

    destroy() {
        if (WsConnext.all.get(this.connextId) === this) {
            WsConnext.all.delete(this.connextId)
        }
    }

    send(msg: string) {
        this.ws.send(msg)
    }


    ping(){
        if(this.ws.readyState === this.ws.OPEN){
            this.ws.ping(new Date().getTime(),false)
            setTimeout(()=>this.ping(), 1000 * 60)
        }
    }


}

export const connect = new Router()

connect.all('/message/connect/', (ctx) => {
    const id = ctx.params.id
    const ws: WebSocket = (ctx as any).websocket
    new WsConnext(id, ws)
})



export const wss = (app: Koa, port: number) => {
    const server = http.createServer()
    const wss = new WebSocketServer({ server });
    server.on('request', (...argus) => {
        app.callback()(...argus)
    })
    const reg = pathToRegexp('/message/connect/:id')

    wss.on('connection', (ws, request) => {
        if (!request.url) return ws.close()
        const path = new url.URL(request.url || '', 'http://localhost:4002/').pathname
        const id = reg.exec(path)?.[1]

        if (!id) return ws.close()
        new WsConnext(id, ws)
    })


    server.listen(port)
}










