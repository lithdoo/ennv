import { EnTask, EnTaskClientHandler } from "./utils/task"


class TestTaskHandle implements EnTaskClientHandler {
    element: HTMLElement = document.createElement('div')
    onMsg = (msg: unknown) => { }
    onComplete = (res: Response) => { }
    onError = (msg: string) => { }

    tid: string
    path: string



    constructor(tid: string, path: string) {
        this.tid = tid
        this.path = path
        this.element.innerHTML = 'loading...'
    }


    async init(res: Response) {
        const { html } = await res.json()
        this.element.innerHTML = html
        return this
    }


}

EnTask.regist('hello', {
    name: 'hello',
    icon: ['i_file', 'database', '#66ccff'],
    apply: (fb) => fb.kind === "folder"
}, (tid, path, res) => new TestTaskHandle(tid, path).init(res))