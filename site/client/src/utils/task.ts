import { makeAutoObservable } from "mobx"
import { actions } from '@ennv/action'
import { FileStat } from "@/utils/webdav"

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

    reconnectTimeout: any | null = null
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
                console.log('wsMessage', obj)
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
    undo = 'undo',
    preparing = 'preparing',
    pendding = 'pendding',
    canceled = 'canceled',
    completed = 'completed',
    error = 'error',
}

type DeleteProp<Obj, Key> = {
    [K in Exclude<keyof Obj, Key>]: Obj[K]
}

type DeleteProps<Obj, Keys extends any[]> = ((...argus: Keys) => void) extends ((key: infer Key, ...next: infer Next extends any[]) => void)
    ? Next extends []
    ? DeleteProp<Obj, Key>
    : DeleteProps<DeleteProp<Obj, Key>, Next>
    : never


export type FetchOption = Partial<DeleteProps<RequestInit, ['method', 'signal']>>
export type StartFn = (option: FetchOption) => void

type CreateHandler = (taskId: string, path: string, response: Response, start: StartFn) => EnTaskClientHandler | Promise<EnTaskClientHandler>


export class EnTaskContainer {

    cntr = document.createElement('div')

    mount(element: HTMLElement) {
        this.cntr.style.height = '100%'
        this.cntr.appendChild(element)
    }

    error(msg: string) {
        this.cntr.innerHTML = `
        <h1 style="color:red">${msg}</h1>
        `
    }

}


export class EnTask {
    static actions = () => actions.all
    static fileActions(fb: FileStat) {
        return Array.from(EnTask.actions().values())
            .filter(v => v.option.apply(fb))
    }

    id = Math.random().toString()
    fileStat: FileStat
    status: TaskStatus = TaskStatus.undo
    key: string = ''
    taskId: string = ''
    path: string = ''
    createHandler: CreateHandler
    option: EnTaskClientOption
    handle: EnTaskClientHandler | null = null
    cntr = new EnTaskContainer()


    error(msg: string) {
        this.cntr.error(msg)
    }

    constructor(key: string, stat:FileStat) {
        makeAutoObservable(this)
        this.key = key
        this.path = stat.filename
        const task = EnTask.actions().get(key)
        this.fileStat = stat
        if (!task) throw new Error(`handel named "${key}" is not found.`)
        this.createHandler = task.createHandler
        this.option = task.option
        this.prepare()
    }

    async prepare() {
        const res = await this.preparing()
        if (!res) return

        this.taskId = res.id
        this.handle = await this.createHandler(
            this.taskId,
            this.path,
            res.response,
            (option) => this.start(option)
        )
        this.cntr.mount(this.handle.element)
    }

    start(fetchOption: FetchOption) {
        this.pendding(fetchOption)
    }

    cancel() {
        this.done(TaskStatus.canceled, () => {
            if (this.controller) this.controller.abort()
        })
    }

    private controller: AbortController | null = null

    private async preparing() {
        if (this.status !== TaskStatus.undo) return
        this.status = TaskStatus.preparing
        const response = await fetch(`/task/prepare/${encodeURIComponent(this.key)}?path=${encodeURIComponent(this.path)}`, {
            method: 'get',
        }).then(response => {
            if (!response.ok) throw new Error(response.statusText)
            else return response
        }).catch((error) => {
            this.done(TaskStatus.error, () => {
                this.error(`prepare request error: ${error.message}`)
            })
            return null
        })

        if (!response) return

        const id = response.headers.get('ennv-task-id')

        if (typeof id !== 'string') return this.done(TaskStatus.error, () => {
            this.error(`prepare request error: response data error`)
        })

        return { id, response }
    }
    private pendding(fetchOption: FetchOption) {
        if (this.status !== TaskStatus.preparing) return
        this.status = TaskStatus.pendding

        const controller = new AbortController()

        fetch(`/task/start/${encodeURIComponent(this.key)
            }?path=${encodeURIComponent(this.path)
            }`, {
            ...fetchOption,
            method: 'post',
            signal: controller.signal
        }).then(response => {
            if (!response.ok) throw new Error(response.statusText)
            else return response
        }).then(response => {
            this.done(TaskStatus.completed, () => {
                this.handle?.onComplete(response)
            })
        }).catch(error => {
            this.done(TaskStatus.error, () => {
                this.handle?.onError(error.message)
                this.error(error.message)
            })
        }).finally(() => {
            this.controller = null
        })

        this.controller = controller
    }
    private done(
        status: TaskStatus.canceled | TaskStatus.completed | TaskStatus.error,
        callback: () => void
    ) {
        if (
            (this.status !== TaskStatus.pendding)
            && (this.status !== TaskStatus.preparing)
        ) return

        this.status = status
        callback()
    }
}

export interface EnTaskClientOption {
    name: string,
    icon: [string, string, string],
    apply: (file: FileStat) => boolean
}

export interface EnTaskClientHandler {
    element: HTMLElement
    onMsg: (msg: unknown) => void
    onComplete: (res: Response) => void
    onError: (msg: string) => void
}




