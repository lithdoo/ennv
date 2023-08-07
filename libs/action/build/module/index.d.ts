type DeleteProp<Obj, Key> = {
    [K in Exclude<keyof Obj, Key>]: Obj[K];
};
type DeleteProps<Obj, Keys extends any[]> = ((...argus: Keys) => void) extends ((key: infer Key, ...next: infer Next extends any[]) => void) ? Next extends [] ? DeleteProp<Obj, Key> : DeleteProps<DeleteProp<Obj, Key>, Next> : never;
export type FetchOption = Partial<DeleteProps<RequestInit, ['method', 'signal']>>;
export type StartFn = (option: FetchOption) => void;
export interface FileInfo {
    name: string;
    path: string;
    kind: 'file' | 'folder';
}
export interface EnActionOption {
    name: string;
    icon: [string, string, string];
    apply: (file: FileInfo) => boolean;
}
export interface EnActionHandler {
    element: HTMLElement;
    onMsg: (msg: unknown) => void;
    onComplete: (res: Response) => void;
    onError: (msg: string) => void;
}
type CreateHandler = (actionId: string, path: string, response: Response, start: StartFn) => EnActionHandler | Promise<EnActionHandler>;
export declare class EnActions {
    all: Map<string, {
        key: string;
        option: EnActionOption;
        createHandler: CreateHandler;
    }>;
    regist(key: string, option: EnActionOption, createHandler: CreateHandler): void;
}
declare global {
    interface Window {
        en_actions: EnActions;
        __en_actions__: boolean;
    }
}
export declare const actions: EnActions;
export {};
