type DeleteProp<Obj, Key> = {
    [K in Exclude<keyof Obj, Key>]: Obj[K]
}

type DeleteProps<Obj, Keys extends any[]> = ((...argus: Keys) => void) extends ((key: infer Key, ...next: infer Next extends any[]) => void)
    ? Next extends []
    ? DeleteProp<Obj, Key>
    : DeleteProps<DeleteProp<Obj, Key>, Next>
    : never

export interface EnFile<Extra = undefined> {
    filename: string;
    basename: string;
    lastmod: string;
    size: number;
    type: "file" | "directory";
    etag: string | null;
    symlink: boolean,
    extra: Extra
}

export type FetchOption = Partial<DeleteProps<RequestInit, ['method', 'signal']>>

export type StartFn = (option: FetchOption) => void

export interface FileInfo {
    name: string
    path: string
    kind: 'file' | 'folder'
}

export interface EnActionOption<Extra = undefined> {
    name: string,
    icon: [string, string, string],
    apply: (file: EnFile<Extra>) => boolean
}

export interface EnActionHandler {
    element: HTMLElement
    onMsg: (msg: unknown) => void
    onComplete: (res: Response) => void
    onError: (msg: string) => void
}

type CreateHandler = (actionId: string, path: string, response: Response, start: StartFn) => EnActionHandler | Promise<EnActionHandler>

export class EnActions {
    all: Map<string, {
        key: string,
        option: EnActionOption,
        createHandler: CreateHandler
    }> = new Map()

    regist(key: string, option: EnActionOption, createHandler: CreateHandler) {
        this.all.set(key, { key, option, createHandler: createHandler })
    }
}

declare global {
    interface Window {
        en_actions: EnActions;
        __en_actions__: boolean;
    }
}

export const actions = (() => {
    if ((typeof window !== 'undefined') && window['__en_actions__'] && window['en_actions']) {
        return window['en_actions'];
    } else {
        window['__en_actions__'] = true
        return window['en_actions'] = new EnActions()
    }
})()


