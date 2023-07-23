import { EnTask, EnTaskClientHandler, StartFn } from "./utils/task"


class TestTaskHandle implements EnTaskClientHandler {
    element: HTMLElement = document.createElement('div')
    onMsg = (msg: unknown) => { }
    onError = (msg: string) => { }

    tid: string
    path: string



    constructor(tid: string, path: string) {
        this.tid = tid
        this.path = path
        this.element.innerHTML = 'loading...'
    }


    async init(res: Response, start: StartFn) {
        const { html } = await res.json()
        this.element.innerHTML = html
        const btnStart = document.createElement('button');
        btnStart.onclick = () => start({
            body: JSON.stringify({ time: new Date().getTime() })
        })
        btnStart.innerText = 'START'
        this.element.appendChild(btnStart)
        return this
    }


    onComplete(res: Response){
        this.element.innerHTML = `task complete`
    }


}

EnTask.regist('hello', {
    name: 'hello',
    icon: ['i_file', 'database', '#66ccff'],
    apply: (fb) => fb.kind === "folder"
}, (tid, path, res, start) => new TestTaskHandle(tid, path).init(res, start))