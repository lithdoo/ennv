import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const instance = new class {
    getSetLang: () => Promise<(lang: string) => void>
    resolveSetLang: (setLang: (lang: string) => void) => void
    getEditor: () => Promise<monaco.editor.IStandaloneCodeEditor>
    resolveEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void
    onSave: (text: string) => void = () => { }


    constructor() {
        const promiseSetLang = new Promise<(lang: string) => void>((resole) => {
            this.resolveSetLang = resole
        })
        this.getSetLang = () => promiseSetLang

        const promiseEditor = new Promise<monaco.editor.IStandaloneCodeEditor>((resole) => {
            this.resolveEditor = resole
        })
        this.getEditor = () => promiseEditor
    }

    async run(text: string) {
        const editor = await this.getEditor()
        editor.setValue(text)
        this.changeLang('')
    }

    async changeLang(lang: string) {
        const setLang = await this.getSetLang()
        const editor = await this.getEditor()
            ; (editor.getModel() as any).setLanguage(lang)
        setLang(lang)
    }

    async save() {
        const editor = await this.getEditor()
        const value = editor.getValue()
        this.onSave(value)
    }

}


    ; (window as any).run = (text: string) => {
        instance.run(text)
    }
    ; (window as any).onSave = (func: (text:string)=>void) => {
        instance.onSave = func
    }
    