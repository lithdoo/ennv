import SysTray from "@ennv/systray";
import CryptoJS from 'crypto-js';
import path from "path";
import fs from 'fs';
export const tray = new class {
    systray;
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
                on: () => { tray.kill(); }
            }];
    }
    events() {
        const list = this.actions().map(v => v.on);
        return (e) => {
            const idx = e.seq_id;
            const fn = list[idx];
            if (fn)
                fn();
        };
    }
    async icon() {
        const filePath = process.platform.indexOf('win32') >= 0
            ? path.resolve(__dirname, "../../assets/logo/favicon64.ico")
            : path.resolve(__dirname, "../../assets/logo/favicon64.png");
        const base64 = async (filePath) => {
            if (!fs.existsSync(filePath))
                throw new Error(`file is not exsit !(${filePath})`);
            const buffer = await fs.promises.readFile(filePath);
            const arrayBuffer = new ArrayBuffer(buffer.length);
            // buffer 转 ArrayBuffer
            var view = new Uint8Array(arrayBuffer);
            for (var i = 0; i < buffer.length; ++i) {
                view[i] = buffer[i];
            }
            const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
            return CryptoJS.enc.Base64.stringify(wordArray);
        };
        return await base64(filePath);
    }
    async items() {
        return (await this.actions()).map(({ title, tooltip, checked, enabled }) => ({ title, tooltip, checked, enabled }));
    }
    async init() {
        const icon = (await this.icon()) || '';
        const items = await this.items();
        this.systray = new SysTray({
            menu: {
                title: "Ennv",
                tooltip: "Ennv",
                icon, items,
            }
        });
        this.systray.onClick(this.events());
    }
    async kill() {
        if (this.systray)
            this.systray.kill();
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy90cmF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBdUIsTUFBTSxlQUFlLENBQUE7QUFDbkQsT0FBTyxRQUFRLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQTtBQUN2QixPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUE7QUFFbkIsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUk7SUFFcEIsT0FBTyxDQUFVO0lBRWpCLE9BQU87UUFDSCxPQUFPLENBQUM7Z0JBQ0osS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLE9BQU8sRUFBRSxvQkFBb0I7Z0JBQzdCLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE9BQU8sRUFBRSxLQUFLO2FBQ2pCLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLE9BQU8sRUFBRSxtQkFBbUI7Z0JBQzVCLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE9BQU8sRUFBRSxLQUFLO2FBQ2pCLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLE9BQU8sRUFBRSxjQUFjO2dCQUN2QixPQUFPLEVBQUUsS0FBSztnQkFDZCxPQUFPLEVBQUUsSUFBSTtnQkFDYixFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBLENBQUMsQ0FBQzthQUM1QixDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsTUFBTTtRQUNGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7UUFFMUMsT0FBTyxDQUFDLENBQWEsRUFBRSxFQUFFO1lBQ3JCLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUE7WUFDcEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdB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