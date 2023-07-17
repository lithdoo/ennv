import { getDiskList } from "@/request/file"
import { action, makeAutoObservable } from "mobx"


class WorkSpace {
    path: string = ''
    accessble: boolean = true
    folderTree: FolderTreeItem[] = []
}

interface FolderTreeItem {
    id: string,
    pid: string,
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

    constructor() {
        makeAutoObservable(this)
    }


    open(ws: WorkSpace) {
        this.list = this.list.concat([ws])
        this.current = ws
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
    layout:TaskListLayout = TaskListLayout.min
    list: EnTask[] = []
    detail?: EnTask
}
export const stateLayout = new class {

    constructor() {
        makeAutoObservable(this)
    }

}














export enum BarStatus {
    min = 'bar-min',
    max = 'bar-max',
    normal = 'bar-normal',
}
export const barState = new class {

    status: BarStatus = BarStatus.min

    constructor() {
        makeAutoObservable(this)
    }

    minimize() {
        this.status = BarStatus.min
    }

    maximize() {
        this.status = BarStatus.max
    }

    normalize() {
        this.status = BarStatus.normal
    }
}
export enum RootStatus {
    edit = 'root-edit',
    normal = 'root-normal',
}
export const rootState = new class {
    status: RootStatus = RootStatus.normal
    diskList: string[] = []
    focus?: WorkSpace
    workspaces: WorkSpace[] = []

    constructor() {
        makeAutoObservable(this)
    }

    changeStatus(status: RootStatus) {
        this.status = status
    }

    toggle() {
        this.status = this.status === RootStatus.edit ? RootStatus.normal : RootStatus.edit
        if (this.status === RootStatus.edit) { this.reflashDiskList() }
    }

    async reflashDiskList() {
        const list = await getDiskList()
        action(() => { this.diskList = list })()
    }


    addWorkSpace(path: string[]) {
        this.workspaces.push(new WorkSpace)

    }

}
export enum LayoutStatus {
    focusRoot = 'focus-root',
    focusTask = 'focus-task',
    normalMinTask = 'normal-min_task',
    normal = 'normal'
}
export const layoutState = new class {
    get status() {
        if (rootState.status === RootStatus.edit) {
            return LayoutStatus.focusRoot
        }

        if (barState.status === BarStatus.max) {
            return LayoutStatus.focusTask
        }

        if (barState.status === BarStatus.min) {
            return LayoutStatus.normalMinTask
        }


        return LayoutStatus.normal
    }

    constructor() {
        makeAutoObservable(this)
    }
}