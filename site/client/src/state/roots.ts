import { getDiskList } from "@/request/file"
import { action, makeAutoObservable } from "mobx"


class WorkSpace {
    disk: string = ''
    path: string[] = []
    currentDir0: string[] = []
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
        if(this.status === RootStatus.edit){this.reflashDiskList()}
    }

    async reflashDiskList() {
        const list = await getDiskList()
        action(() => {this.diskList = list })()
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