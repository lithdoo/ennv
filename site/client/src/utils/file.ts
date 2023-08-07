

type FileTypeOption = {
    name: string,
    description: string,
    icon: { family: string, name: string },
    reg: string
}



export class FileType {
    // 所有文件类型列表
    static all: FileType[] = []
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