import { StartFn, actions, EnActionHandler } from '@ennv/action'

class TypeJsonTaskHandle implements EnActionHandler {
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
        this.element.style.height = '100%'
        this.element.innerHTML = `<iframe style="height:100%;width:100%;border:none" src="/plugin/static/json-editor/index.html">`
        start({})
        return this
    }

    async onComplete(res: Response) {
        console.log('onComplete', res)
    }
}

actions.regist('type-json', {
    name: 'type-json',
    icon: ['i_file', 'database', '#66ccff'],
    apply: (fb) => /\.tpjson$/.test(fb.filename)
}, (tid, path, res, start) => new TypeJsonTaskHandle(tid, path).init(res, start))