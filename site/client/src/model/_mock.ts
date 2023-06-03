import { EnFile, FileType } from "./file"
import { EnAction, EnTask ,TaskStatus} from "./task"

export const dirList = new Array(100).fill(0)
    .map(() => {
        return new EnFile()
    })
    .map((item, index) => {
        item.name = `image-${index}.jpg`
        item.size = 10000
        item.type = FileType.type(item.name)
        return item
    })

export const taskList = new Array(4).fill(0)
    .map(()=>{
        return new EnTask()
    })
    .map((item)=>{
        item.action = EnAction.all[0]
        item.status = TaskStatus.completed
        item.target = new EnFile()
        item.target.dirPath = '/aaa/nnn.ts'

        return item
    })