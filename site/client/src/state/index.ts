import * as webdav from '@/utils/webdav'
import { type FileStat } from '@/utils/webdav'
import { EnTask } from "@/utils/task"
import { action, autorun, makeAutoObservable } from "mobx"


interface WorkSpace {
    folder: FileStat
    accessble: boolean
    folderTree: FolderTreeItem[]
}

export interface FolderTreeItem {
    id: string,
    stat: FileStat,
    pid?:string,
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


    async open(folder: FileStat) {

        const current = this.list.find(v => v.folder.filename === folder.filename)

        if (current) {

            alert(`已经打开了 ${folder.filename}`)
            this.current = current
            this.layout = WorkspaceLayout.sider

            stateCurrentDir.open(current)

        } else {


            const folderTree: FolderTreeItem[] = (await webdav.getDirFolders(folder.filename))
                .map((stat) => ({
                    id: stat.filename,
                    stat,
                    isLoaded: false, isOpen: false, isLeaf: false,
                }))

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
        this.current = this.list.find(w => w.folder.filename === ws.folder.filename)
        if (this.current) stateCurrentDir.open(this.current)
    }

    private async reflashDisks() {
        const list = ['/']
        action(() => { this.disks = list })()
    }

}

export const stateCurrentDir = new class {
    ws?: WorkSpace
    // path: string = ''
    folder?: FileStat
    accessble?: boolean   // 为 undefined 的时候 为loding
    active?: FileStat
    list: (FileStat)[] = []

    constructor() {
        makeAutoObservable(this)
    }

    async open(ws: WorkSpace, folder: FileStat = ws.folder) {

        this.accessble = undefined

        this.folder = folder
        this.ws = ws
        this.list = []
        this.active = undefined
        stateSiderInfo.loadDir(folder)
        stateSiderInfo.removeTarget()


        let accessble = false
        let list: (FileStat)[] = []

        try {
            list = //(
                await webdav.getDirContents(folder.filename)
            // .map(val => assign(
            //     val.isFolder ? new EnFolder() : new EnFile(), {
            //     name: val.name,
            //     path: val.path,
            //     accessble: true
            // }, val.isFolder ? {} : {
            //     type: FileType.type(val.name)
            // }))
            accessble = true
        } catch (e) {
            accessble = false

        } finally {
            action(() => {
                if (this.folder?.filename !== folder.filename) return
                this.list = list
                this.accessble = accessble
            })()
        }
    }

    async focus(file: FileStat) {
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

    currentDir?: FileStat
    loadingDir?: FileStat

    currentTarget?: FileStat
    loadingTarget?: FileStat

    actions: [] = []

    constructor() {
        makeAutoObservable(this)
    }

    async loadDir(folder: FileStat) {
        this.loadingDir = folder
        const detail = folder // await getFolderDetail(folder)

        if (detail.filename !== this.loadingDir?.filename) return

        action(() => {
            this.currentDir = detail
            this.loadingDir = undefined
        })()
    }
    async loadTarget(target: FileStat) {

        this.loadingTarget = target
        const detail = target
            // await (target.kind === 'folder'
            // ? getFolderDetail(target as EnFolder)
            // : getFileDetail(target as EnFile))

        if (detail.filename !== this.loadingTarget?.filename) return

        action(() => {
            this.currentTarget = detail
            this.loadingTarget = undefined
        })()
    }
    async removeTarget() {
        this.currentTarget = undefined
        this.loadingTarget = undefined
    }
}

export enum TaskListLayout {
    min = 'tasklist-min',
    brief = 'tasklist-brief',
    max = 'tasklist-max',
    detail = 'tasklist-detail'
}
export const stateTaskList = new class {
    status: TaskListLayout.min | TaskListLayout.max | TaskListLayout.brief
        = TaskListLayout.min
    list: EnTask[] = []
    detail?: EnTask
    detailElement = document.createElement('div')

    get layout() {
        if (this.detail) return TaskListLayout.detail
        else return this.status
    }

    constructor() {
        makeAutoObservable(this)
        this.detailElement.style.height = '100%'
    }

    focus(task: EnTask) {
        this.detail = task
    }

    create(key: string, stat:FileStat) {
        this.list.push(new EnTask(key, stat))
        if (this.status !== TaskListLayout.min) return
        if (this.detail) return
        this.status = TaskListLayout.brief
    }

    min() {
        this.status = TaskListLayout.min
        this.detail = undefined
    }

    brief() {
        this.status = TaskListLayout.brief
        this.detail = undefined
    }

    max() {
        this.status = TaskListLayout.max
        this.detail = undefined
    }
}

autorun(() => {
    const detail = stateTaskList.detail
    stateTaskList.detailElement.innerHTML = ''
    if (detail) {
        stateTaskList.detailElement.appendChild(detail.cntr.cntr)
    }
})
