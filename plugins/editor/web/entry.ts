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
        console.log(res, start)
        this.element.style.height = '100%'
        this.element.innerHTML = `<iframe style="height:100%;width:100%;border:none" src="/plugin/static/text-editor/index.html">`

        start({})
        return this
    }

    async onComplete(res: Response) {
        console.log('onComplete', res)
        const blob = await res.blob()
        const text = await blob.text()
        const outer = this.element.querySelector('iframe')

        if (outer) {
            outer.onload = () => {
                if ((outer as any).contentWindow.run) {
                    ; (outer as any).contentWindow.run(text)
                        ; (outer as any).contentWindow.onSave((text: string) => {
                            let data = new FormData();
                            data.append('file', new File([new Blob([text])], 'data'))
                            fetch(`/plugin/requset/text-editor/save?path=${encodeURIComponent(this.path)}`, {
                                method: 'post',
                                body: data,
                            })
                        })
                }
            }

        }
    }
}

actions.regist('text-editor', {
    name: 'text-editor',
    icon: ['i_file', 'database', '#66ccff'],
    apply: (fb) => true
}, (tid, path, res, start) => new TestTaskHandle(tid, path).init(res, start))