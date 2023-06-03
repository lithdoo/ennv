

type FileTypeOption = {
    name: string,
    description: string,
    icon: { family: string, name: string },
    reg: string
}



export class FileType {
    // 所有文件类型列表
    static all: FileType[]
    // 特殊文件类型（unknown）
    static unknown = new FileType({
        name: 'unkown',
        description: '',
        icon: { family: 'i_file', name: 'unknown' },
        reg: '\s*'
    })
    // 根据文件名获取文件类型
    static type(fileName: string) {
        const type = FileType.all.find(type => type.reg.test(fileName))
        return type ?? FileType.unknown
    }

    name: string
    description: string
    icon: [string, string]
    reg: RegExp

    constructor(option: FileTypeOption) {
        this.name = option.name
        this.description = option.description
        this.icon = [option.icon.family, option.icon.name]
        this.reg = new RegExp(option.reg)
    }

}

    // 初始化文件类型列表
    ;
((...list: FileTypeOption[]) => {
    FileType.all = list.map(option => new FileType(option))
})({
    name: '图片',
    description: '',
    icon: { family: 'i_file', name: 'image' },
    reg: '\.(png|jpe?g|gif|svg)$',
})


// 基础类
abstract class Base {
    name: string = ''
    dirPath: string = '/'
    rootDir: string = ''
    isFocus: boolean = false

    _key = Math.random()

    abstract kind: 'file' | 'folder'
}

// 文件类
export class EnFile extends Base {

    type: FileType = null as any
    kind: 'file' | 'folder' = 'file'
    size: number = 0

}

// 文件夹类
export class EnFolder extends Base {
    kind: 'file' | 'folder' = 'folder'
}
