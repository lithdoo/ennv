export declare class WsMsgConnectCenter {
    connects: Map<string, WsMsgConnect>;
    add(connect: WsMsgConnect): void;
    cancel(connectId: string): void;
    remove(connectId: string): void;
}
export declare class WsMsgConnect {
    expire: number;
    task: ConnectTask[];
    connectId: string;
    destroy(): void;
}
declare enum ConnectTaskStatus {
    opened = 0,
    preding = 1,
    error = 2,
    completed = 3
}
export declare class ConnectTask {
    status: ConnectTaskStatus;
    connextId: string;
    taskId: string;
    cancel(): void;
    error(): void;
    complete(): void;
}
export {};
