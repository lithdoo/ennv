import { StartFn, actions, EnActionHandler } from '@ennv/action'

class TestTaskHandle implements EnActionHandler {
    element: HTMLElement = document.createElement('div')
    onMsg = (msg: unknown) => { console.log('onMsg', msg) }
    onError = (msg: string) => { console.log('onError', msg) }

    tid: string
    path: string

    constructor(tid: string, path: string) {
        this.tid = tid
        this.path = path
        this.element.innerHTML = 'loading...'
    }

    async init(res: Response, start: StartFn) {
        console.log(res,start)
        this.element.innerHTML = `<iframe style="height:100%;width:100%;border:none" src="/plugin/static/gba-emulator/index.html">`
        // const { html } = await res.json()
        // this.element.innerHTML = html
        // const btnStart = document.createElement('button');
        // btnStart.onclick = () => start({
        //     body: JSON.stringify({ time: new Date().getTime() })
        // })
        // btnStart.innerText = 'START'
        // this.element.appendChild(btnStart)
        return this
    }

    onComplete(res: Response) {
        console.log('onComplete', res)
        this.element.innerHTML = `task complete`
    }

}

actions.regist('gba-emulator', {
    name: 'gba-emulator',
    icon: ['i_file', 'database', '#66ccff'],
    apply: (fb) => fb.type === 'directory'
}, (tid, path, res, start) => new TestTaskHandle(tid, path).init(res, start))