import SysTray, { ClickEvent } from "@ennv/systray"
import CryptoJS from 'crypto-js';
import path from "path"
import fs from 'fs'

export const tray = new class {

    systray?: SysTray

    actions() {
        return [{
            title: "创建 Ennv 链接",
            tooltip: "在浏览器打开一个新的 Ennv 页面",
            checked: false,
            enabled: false,
        }, {
            title: "查看 Ennv 文档",
            tooltip: "在浏览器中打开 Ennv 在线文档",
            checked: false,
            enabled: false
        }, {
            title: "退出 Ennv",
            tooltip: "关闭 Ennv 后台程序",
            checked: false,
            enabled: true,
            on: () => { tray.kill() }
        }]
    }

    events() {
        const list = this.actions().map(v => v.on)

        return (e: ClickEvent) => {
            const idx = e.seq_id
            const fn = list[idx]
            if (fn) fn()
        }

    }

    async icon() {
        const filePath = process.platform.indexOf('win32') >= 0
            ? path.resolve(__dirname, "../../assets/logo/favicon64.ico")
            : path.resolve(__dirname, "../../assets/logo/favicon64.png")


        const base64 = async (filePath: string) => {
            if (!fs.existsSync(filePath)) throw new Error(`file is not exsit !(${filePath})`)
            const buffer = await fs.promises.readFile(filePath)
            const arrayBuffer = new ArrayBuffer(buffer.length)

            // buffer 转 ArrayBuffer
            var view = new Uint8Array(arrayBuffer);
            for (var i = 0; i < buffer.length; ++i) {
                view[i] = buffer[i];
            }

            const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer as any)

            return CryptoJS.enc.Base64.stringify(wordArray)
        }

        return await base64(filePath)
    }

    async items() {
        return (await this.actions()).map(({ title, tooltip, checked, enabled }) => ({ title, tooltip, checked, enabled }))

    }

    async init() {
        const icon = (await this.icon()) || ''
        const items = await this.items()
        this.systray = new SysTray({
            menu: {
                title: "Ennv",
                tooltip: "Ennv",
                icon, items,
            }
        })

        this.systray.onClick(this.events())
    }

    async kill() {
        if (this.systray) this.systray.kill()
    }
}
