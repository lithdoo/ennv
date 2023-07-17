export class WsMsgConnectCenter {
    connects: Map<string, WsMsgConnect> = new Map()
    add(connect: WsMsgConnect) {
        const { connectId } = connect
        if (this.connects.has(connectId)) {
            throw new Error('connectId has been used!')
        }
        this.connects.set(connectId, connect)
    }

    cancel(connectId: string) {
        const connect = this.connects.get(connectId)
        if (!connect) return
        connect.expire = new Date().getTime() + 1000 * 60
    }

    remove(connectId: string) {
        const connect = this.connects.get(connectId)
        if (!connect) return
        this.connects.delete(connectId)
        connect.destroy()
    }
}

export class WsMsgConnect {
    expire: number = Infinity // 过期时间
    task: ConnectTask[] = []
    connectId: string = ''
    destroy() { }
}


enum ConnectTaskStatus {
    opened,
    preding,
    error,
    completed
}
export class ConnectTask {
    status: ConnectTaskStatus = ConnectTaskStatus.opened
    connextId: string = ''
    taskId: string = ''

    cancel() { }
    error() { }
    complete() { }
}