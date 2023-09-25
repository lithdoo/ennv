import Koa from 'koa';
import { EnFileDisk } from "@ennv/disk";
export { taskManager, type EnTaskHandler } from './request/task';
export declare class EnnvServer {
    app: Koa<Koa.DefaultState, Koa.DefaultContext>;
    constructor();
    loadFileDisk<T>(fd: EnFileDisk<T>): void;
    useMiddleware(middleware: Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, any>): void;
    setExtraFiles({ scripts, stylesheets }: {
        scripts?: string[];
        stylesheets?: string[];
    }): void;
    listen(port: number): void;
}
