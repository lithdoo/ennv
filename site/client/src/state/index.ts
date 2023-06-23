import { EnFile, EnFolder, FileType } from "@/model/file"
import { getDirContent, getDirFolders, getDiskList } from "@/request/file"
import { assign } from "@/utils/base"
import { action, makeAutoObservable } from "mobx"


interface WorkSpace {
    path: string
    accessble: boolean
    folderTree: FolderTreeItem[]
}

interface FolderTreeItem {
    id: string,
    pid?: string,
    name: string,
    path: string,
    isOpen: boolean,
    isLeaf: boolean,
    isLoaded: boolean,
}



export enum WorkspaceLayout {
    sider = 'workspace-layout-sider',
    edit = 'workspace-layout-edit'
}

export const stateWorkspaces = new class {

    layout: WorkspaceLayout = WorkspaceLayout.edit
    list: WorkSpace[] = []
    current?: WorkSpace

    // edit
    disks: string[] = []

    constructor() {
        makeAutoObservable(this)
        this.reflashDisks()
    }


    async open(path: string) {

        const current = this.list.find(v => v.path === path)

        if (current) {

            alert(`已经打开了 ${path}`)
            this.current = current
            this.layout = WorkspaceLayout.sider

            stateCurrentDir.open(current)

        } else {

            const folderTree: FolderTreeItem[] = (await getDirFolders(path))
                .map(({ name, isLeaf }) => {
                    const id = `${path}/${name}`
                    return { id, name, isLeaf, path: id, isLoaded: false, isOpen: false }
                })

            const workspace: WorkSpace = { path, folderTree, accessble: true }

            action(() => {
                this.list = this.list.concat([workspace])
                this.current = workspace
                this.layout = WorkspaceLayout.sider

                stateCurrentDir.open(workspace)
            })()

        }

    }

    async edit() {
        this.layout = WorkspaceLayout.edit
        await this.reflashDisks()
    }


    loadTree(ws: WorkSpace, tree: FolderTreeItem[]) {
        ws.folderTree = tree
    }

    focus(ws: WorkSpace) {
        this.current = this.list.find(w => w.path === ws.path)
        if(this.current) stateCurrentDir.open(this.current)
    }

    private async reflashDisks() {
        const list = await getDiskList()
        action(() => { this.disks = list })()
    }

}

export const stateCurrentDir = new class {
    ws?: WorkSpace
    path: string = ''
    accessble?: boolean   // 为 undefined 的时候 为loding
    active?: EnFile | EnFolder
    list: (EnFile | EnFolder)[] = []

    constructor() {
        makeAutoObservable(this)
    }

    async open(ws: WorkSpace, path: string = ws.path) {

        this.accessble = undefined

        this.path = path 
        this.ws = ws
        this.list = []
        this.active = undefined

        let accessble = false
        let list: (EnFile | EnFolder)[] = []

        try {
            list = (await getDirContent(path)).map(val => assign(
                val.isFolder ? new EnFolder() : new EnFile(), {
                name: val.name,
                path: val.path,
                accessble: true
            }, val.isFolder ? {} : {
                type: FileType.type(val.name)
            }))
            accessble = true
        } catch (e) {
            accessble = false

        } finally {
            action(() => {
                if (this.path !== path) return
                this.list = list
                this.accessble = accessble
                console.log(this)
            })()
        }
    }

    async focus(file: EnFile | EnFolder){
        this.active = file
    }
    async blur(){
        this.active = undefined
    }


}

export const stateSiderInfo = new class {
    root: string = ''
    // currentDir?: FolderInfo  // 仅当未打开任何 workspace 才为空
    // target?: FolderInfo | FileInfo
    actions: [] = []
}

interface EnTask { }

export enum TaskListLayout {
    min = 'tasklist-min',
    brief = 'tasklist-brief',
    max = 'tasklist-max',

}
export const stateTaskList = new class {
    layout: TaskListLayout = TaskListLayout.min
    list: EnTask[] = []
    detail?: EnTask
}
export const stateLayout = new class {

    constructor() {
        makeAutoObservable(this)
    }

}


