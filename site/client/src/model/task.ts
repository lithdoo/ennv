// import { EnFile, EnFolder } from "./file"

// type ActionOption = {
//     name: string,
//     description: string,
//     icon: { family: string, name: string }
// }



// export class EnAction {
//     static all: EnAction[] = []
//     name: string = ''
//     description: string = ''
//     icon: [string, string] = ['', '']
//     type: 'excu' | 'optional' = 'excu'

//     constructor(option: ActionOption) {
//         this.name = option.name
//         this.description = option.description
//         this.icon = [option.icon.family, option.icon.name]
//     }
// }
//     // 初始化文件类型列表
//     ;
// ((...list: ActionOption[]) => {
//     EnAction.all = list.map(option => new EnAction(option))
// })({
//     name: '图片',
//     description: '',
//     icon: { family: 'i_file', name: 'image' }
// })


// export enum TaskStatus {
//     preparing,
//     processing,
//     completed,
//     error,
// }

// export class EnTask {
//     action: EnAction = null as any
//     target: EnFile | EnFolder = null as any
//     status: TaskStatus = TaskStatus.preparing

// }
