import { getDirFolders, getDiskList } from "@/request/file"
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

                console.log(stateWorkspaces)
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

    focus(ws:WorkSpace){
        this.current = this.list.find(w=>w.path === ws.path)
    }

    private async reflashDisks() {
        const list = await getDiskList()
        action(() => { this.disks = list })()
    }

}



interface FileBase { }
interface FolderBase { }

interface FileInfo extends FileBase { }
interface FolderInfo extends FolderBase { }

export const stateCurrentDir = new class {
    root: string = ''
    current?: FolderInfo // 仅当未打开任何 workspace 才为空
    list: (FileBase | FolderBase)[] = []
    focus?: FileBase | FolderBase
}


export const stateSiderInfo = new class {
    root: string = ''
    currentDir?: FolderInfo  // 仅当未打开任何 workspace 才为空
    target?: FolderInfo | FileInfo
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


