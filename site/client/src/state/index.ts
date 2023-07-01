import { EnFile, EnFileDetail, EnFolder, EnFolderDetail, FileType } from "@/model/file"
import { getDirContent, getDirFolders, getDiskList, getFileDetail, getFolderDetail } from "@/request/file"
import { assign } from "@/utils/base"
import { action, makeAutoObservable } from "mobx"


interface WorkSpace {
    folder: EnFolder
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


    async open(folder: EnFolder) {

        const current = this.list.find(v => v.folder.path === folder.path)

        if (current) {

            alert(`已经打开了 ${folder.path}`)
            this.current = current
            this.layout = WorkspaceLayout.sider

            stateCurrentDir.open(current)

        } else {

            const folderTree: FolderTreeItem[] = (await getDirFolders(folder.path))
                .map(({ name, isLeaf }) => {
                    const id = `${folder.path}/${name}`
                    return { id, name, isLeaf, path: id, isLoaded: false, isOpen: false }
                })

            // const folder = Folder

            const workspace: WorkSpace = { folder, folderTree, accessble: true }

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
        this.current = this.list.find(w => w.folder.path === ws.folder.path)
        if (this.current) stateCurrentDir.open(this.current)
    }

    private async reflashDisks() {
        const list = await getDiskList()
        action(() => { this.disks = list })()
    }

}

export const stateCurrentDir = new class {
    ws?: WorkSpace
    // path: string = ''
    folder? : EnFolder
    accessble?: boolean   // 为 undefined 的时候 为loding
    active?: EnFile | EnFolder
    list: (EnFile | EnFolder)[] = []

    constructor() {
        makeAutoObservable(this)
    }

    async open(ws: WorkSpace, folder: EnFolder = ws.folder) {

        this.accessble = undefined

        this.folder = folder
        this.ws = ws
        this.list = []
        this.active = undefined
        stateSiderInfo.loadDir(folder)
        stateSiderInfo.removeTarget()


        let accessble = false
        let list: (EnFile | EnFolder)[] = []

        try {
            list = (await getDirContent(folder.path)).map(val => assign(
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
                if (this.folder?.path !== folder.path) return
                this.list = list
                this.accessble = accessble
            })()
        }
    }

    async focus(file: EnFile | EnFolder) {
        this.active = file
        stateSiderInfo.loadTarget(file)
    }
    async blur() {
        this.active = undefined
        stateSiderInfo.removeTarget()
    }


}



export const stateSiderInfo = new class {
    root: string = ''

    currentDir?: EnFolderDetail
    loadingDir?: EnFolder

    currentTarget?: EnFileDetail | EnFolderDetail
    loadingTarget?: EnFile | EnFolder

    actions: [] = []

    constructor(){
        makeAutoObservable(this)
    }

    async loadDir(folder: EnFolder) {
        this.loadingDir = folder
        const detail = await getFolderDetail(folder)

        if (detail.rid !== this.loadingDir?.rid) return
        action(() => {
            this.currentDir = detail
            this.loadingDir = undefined
        })()
    }
    async loadTarget(target: EnFolder | EnFile) {

        this.loadingTarget = target
        const detail = await (target.kind === 'folder'
            ? getFolderDetail(target as EnFolder)
            : getFileDetail(target as EnFile))
        
        if (detail.rid !== this.loadingTarget?.rid) return

        action(() => {
            this.currentTarget = detail
            this.loadingTarget = undefined

            console.log(this)
        })()
    }
    async removeTarget(){
        this.currentTarget = undefined
        this.loadingTarget = undefined
    }
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


