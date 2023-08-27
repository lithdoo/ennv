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
        this.element.style.height = '100%'
        this.element.innerHTML = `<iframe style="height:100%;width:100%;border:none" src="/plugin/static/gba-emulator/index.html">`
        
        start({})
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

    run(file){
        const win = this.element.querySelector('iframe')?.contentDocument?.querySelector('iframe')?.contentWindow
        if(!win) return 
        (win as any).run(file)
    }

    async onComplete(res: Response) {
        console.log('onComplete', res)
        const blob = await res.blob()
        const file = new File([blob],'current.gba')
        const outer = this.element.querySelector('iframe')
        
        if(outer){
           outer.onload = ()=>{
             console.log(outer.contentDocument)
             if(!outer.contentDocument) return 
             const inner = outer.contentDocument.querySelector('iframe')
             
             if(inner?.contentWindow &&( inner.contentWindow as any).run){
                this.run(file)
             }else if(inner){
                inner.onload = ()=>{
                    this.run(file)
                }
             }
           }
        }
    }
}

actions.regist('gba-emulator', {
    name: 'gba-emulator',
    icon: ['i_file', 'database', '#66ccff'],
    apply: (fb) => /\.gba$/.test(fb.filename)
}, (tid, path, res, start) => new TestTaskHandle(tid, path).init(res, start))