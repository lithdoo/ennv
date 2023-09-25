import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
export declare const task: Router<any, {}>;
type RequstCtx = ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>;
export declare const taskManager: {
    all: Map<string, EnTaskHandler>;
    regist(handle: EnTaskHandler): void;
    prepare(key: string, { path, ctx }: {
        path: string;
        ctx: RequstCtx;
    }): Promise<void>;
    start(key: string, { path, taskId, ctx }: {
        path: string;
        taskId: string;
        ctx: RequstCtx;
    }): Promise<void>;
};
export interface EnTaskHandler {
    key: string;
    onPerpare: (option: {
        taskId: string;
        path: string;
    }, ctx: RequstCtx) => unknown;
    onStart: (option: {
        taskId: string;
        path: string;
    }, ctx: RequstCtx) => unknown;
    router?: Router<any, {}>;
}
export {};
