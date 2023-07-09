export enum ConnectStatus {
    off
}
export const connect = new class Connect {
    connectId: string = Math.random().toString().replace('.', '')
    ws: WebSocket | null = null
    online: boolean = false
    constructor() {
        this.reconnect()
    }

    reconnectTimeout: number | null = null
    reconnect() {
        if (this.online || this.ws) {
            return
        } else {
            const ws = new WebSocket(`ws://${window.location.host}/message/connect/${this.connectId}`)

            ws.onopen = () => this.wsOpened()
            ws.onclose = () => this.wsClosed()
            ws.onerror = (ev: Event) => this.wsError(ev)
            ws.onmessage = (ev: MessageEvent) => this.wsMessage(ev)

            this.ws = ws

            if (this.reconnectTimeout)
                clearTimeout(this.reconnectTimeout)

        }

        this.reconnectTimeout = setTimeout(() => {
            this.reconnect()
        }, 5000);
    }
    wsOpened() {
        this.online = true
    }
    wsClosed() {
        this.ws = null
        this.online = false
    }

    wsError(ev: Event) {
        console.error(ev)
    }
    wsMessage(ev: MessageEvent) {
        const data = ev.data
        if (data === 'ping') return this.ws?.send('pong')

        if (typeof data == 'string') {
            try {
                const obj = JSON.parse(data)


            } catch (e) {
                console.error(e)
            }
        }
        console.log(ev)
    }
}


export class MessageReceiver {
    static all: Map<string, MessageReceiver> = new Map()
    recevierId: string = Math.random().toString().replace('.', '')

    constructor(onMsg: (msg: any) => void) {
        this.onMsg = onMsg
        MessageReceiver.all.set(this.recevierId, this)
    }

    destroy() {
        if (MessageReceiver.all.has(this.recevierId))
            MessageReceiver.all.delete(this.recevierId)
    }

    onMsg: (msg: any) => void
}



export enum TaskStatus {
    preparing,
    pendding,
    canceled,
    completed,
    error,
}
export class EnTask<Args, Msg, Result> {

    status:TaskStatus = TaskStatus.preparing

    onMsg: (msg: Msg) => void = () => { }
    onComplete: (res: Result) => void = () => { }

    key: string = ''
    path: string = ''

    constructor(key: string, path: string) {
        this.key = key
        this.path = path
    }

    start(argus:Args){

        fetch(`/task/start/${
            encodeURIComponent(this.key)
        }?path=${
            encodeURIComponent(this.path)
        }`,{
            method:'post',
            body:JSON.stringify(argus),
        })

    }

    cancel(){

    }

}